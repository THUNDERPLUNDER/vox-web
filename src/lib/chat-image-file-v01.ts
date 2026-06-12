/* CONTRACT: In-memory image file validation for product/lab chat attachment — no storage. */
export const CHAT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CHAT_IMAGE_ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/bmp"]);

export type ImageFileValidation =
  | { ok: true; mimeType: string }
  | { ok: false; message: string };

export function resolveChatImageMimeType(file: File): string {
  const raw = (file.type || "").trim().toLowerCase();
  if (raw.startsWith("image/")) return raw;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".bmp")) return "image/bmp";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
}

export function validateChatImageFile(file: File | null | undefined): ImageFileValidation {
  if (!file || file.size <= 0) return { ok: false, message: "Ingen fil valgt." };
  if (file.size > CHAT_IMAGE_MAX_BYTES) {
    return { ok: false, message: "Bildet er for stort (maks 5 MB)." };
  }
  const mimeType = resolveChatImageMimeType(file);
  if (!CHAT_IMAGE_ALLOWED_MIME.has(mimeType)) {
    return { ok: false, message: "Velg et bilde (JPEG, PNG, WebP eller BMP)." };
  }
  return { ok: true, mimeType };
}

export function fileToImageBase64Payload(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const comma = dataUrl.indexOf(",");
      if (comma === -1) {
        reject(new Error("Kunne ikke konvertere bildet."));
        return;
      }
      resolve({ base64: dataUrl.slice(comma + 1), mimeType: resolveChatImageMimeType(file) });
    };
    reader.onerror = () => reject(new Error("Kunne ikke lese bildet."));
    reader.onabort = () => reject(new Error("Lesing av bildet ble avbrutt."));
    reader.readAsDataURL(file);
  });
}
