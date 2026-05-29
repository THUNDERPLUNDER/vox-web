#!/usr/bin/env python3
"""CONTRACT: Generate local contact sheets for Viddel editorial image QA."""

from __future__ import annotations

import argparse
import math
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps
except ModuleNotFoundError:
    print(
        "Pillow is required. Install it with:\n"
        "  python3 -m pip install Pillow\n",
        file=sys.stderr,
    )
    raise SystemExit(1)


SUPPORTED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tif",
    ".tiff",
    ".bmp",
    ".gif",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create numbered PNG contact sheets from an image folder.",
    )
    parser.add_argument("--input", required=True, type=Path, help="Folder with images.")
    parser.add_argument(
        "--output",
        default=Path("contact-sheets"),
        type=Path,
        help="Folder for generated PNG contact sheets. Default: contact-sheets/",
    )
    parser.add_argument("--columns", default=4, type=int, help="Grid columns. Default: 4.")
    parser.add_argument(
        "--per-sheet",
        default=12,
        type=int,
        help="Images per sheet before a new PNG is created. Default: 12.",
    )
    parser.add_argument(
        "--thumb-width",
        default=360,
        type=int,
        help="Image frame width in pixels. Default: 360.",
    )
    parser.add_argument(
        "--thumb-height",
        default=240,
        type=int,
        help="Image frame height in pixels. Default: 240.",
    )
    parser.add_argument(
        "--no-subfolders",
        action="store_true",
        help="Only process the input folder, not image-containing subfolders.",
    )
    return parser.parse_args()


def natural_key(path: Path) -> list[str | int]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", value.strip()).strip("-")
    return slug or "root"


def image_files(folder: Path) -> list[Path]:
    return sorted(
        [path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS],
        key=natural_key,
    )


def image_groups(input_dir: Path, include_subfolders: bool) -> list[tuple[str, list[Path]]]:
    folders = [input_dir]
    if include_subfolders:
        folders.extend(sorted([path for path in input_dir.rglob("*") if path.is_dir()]))

    groups: list[tuple[str, list[Path]]] = []
    for folder in folders:
        files = image_files(folder)
        if not files:
            continue

        relative = folder.relative_to(input_dir)
        label = "root" if str(relative) == "." else slugify(str(relative))
        groups.append((label, files))
    return groups


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def fit_text(text: str, draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont, max_width: int) -> str:
    if draw.textlength(text, font=font) <= max_width:
        return text

    ellipsis = "..."
    available = max_width - draw.textlength(ellipsis, font=font)
    trimmed = ""
    for char in text:
        if draw.textlength(trimmed + char, font=font) > available:
            break
        trimmed += char
    return trimmed.rstrip() + ellipsis


def paste_image(sheet: Image.Image, image_path: Path, x: int, y: int, width: int, height: int) -> None:
    with Image.open(image_path) as image:
        image = ImageOps.exif_transpose(image)
        if getattr(image, "is_animated", False):
            image.seek(0)
        image = image.convert("RGB")
        image.thumbnail((width, height), Image.Resampling.LANCZOS)

        frame = Image.new("RGB", (width, height), "#ffffff")
        image_x = (width - image.width) // 2
        image_y = (height - image.height) // 2
        frame.paste(image, (image_x, image_y))
        sheet.paste(frame, (x, y))


def create_sheet(
    files: list[Path],
    output_path: Path,
    start_number: int,
    columns: int,
    thumb_width: int,
    thumb_height: int,
) -> None:
    padding = 28
    gap = 22
    caption_height = 42
    rows = math.ceil(len(files) / columns)
    width = padding * 2 + columns * thumb_width + (columns - 1) * gap
    height = padding * 2 + rows * (thumb_height + caption_height) + (rows - 1) * gap

    sheet = Image.new("RGB", (width, height), "#f7f7f4")
    draw = ImageDraw.Draw(sheet)
    caption_font = load_font(17)
    caption_color = "#2f3540"

    for index, image_path in enumerate(files):
        row = index // columns
        col = index % columns
        x = padding + col * (thumb_width + gap)
        y = padding + row * (thumb_height + caption_height + gap)

        paste_image(sheet, image_path, x, y, thumb_width, thumb_height)

        number = start_number + index
        caption = fit_text(f"{number:02d}  {image_path.name}", draw, caption_font, thumb_width)
        draw.text((x, y + thumb_height + 12), caption, fill=caption_color, font=caption_font)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, "PNG", optimize=True)


def main() -> int:
    args = parse_args()
    input_dir = args.input.expanduser().resolve()
    output_dir = args.output.expanduser().resolve()

    if not input_dir.exists() or not input_dir.is_dir():
        print(f"Input folder does not exist: {input_dir}", file=sys.stderr)
        return 1
    if args.columns < 1:
        print("--columns must be 1 or higher.", file=sys.stderr)
        return 1
    if args.per_sheet < 1:
        print("--per-sheet must be 1 or higher.", file=sys.stderr)
        return 1

    groups = image_groups(input_dir, include_subfolders=not args.no_subfolders)
    if not groups:
        print(f"No supported images found in {input_dir}", file=sys.stderr)
        return 1

    generated: list[Path] = []
    for group_label, files in groups:
        for page_index, start in enumerate(range(0, len(files), args.per_sheet), start=1):
            chunk = files[start : start + args.per_sheet]
            output_path = output_dir / f"{group_label}-contact-{page_index:02d}.png"
            create_sheet(
                chunk,
                output_path,
                start_number=start + 1,
                columns=args.columns,
                thumb_width=args.thumb_width,
                thumb_height=args.thumb_height,
            )
            generated.append(output_path)

    print("Generated contact sheets:")
    for path in generated:
        print(f"- {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
