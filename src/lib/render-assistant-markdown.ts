/* CONTRACT: Safe DOM renderer for assistant Markdown v0.1 — no innerHTML on raw AI text. */

function appendInlineMarkdown(parent: HTMLElement, content: string): void {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (!part) continue;
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      const strong = document.createElement("strong");
      strong.textContent = boldMatch[1];
      parent.append(strong);
      continue;
    }
    parent.append(document.createTextNode(part));
  }
}

/** Renders a subset of Markdown into container using explicit DOM nodes only. */
export function renderAssistantMarkdownInto(container: HTMLElement, text: string): void {
  container.replaceChildren();

  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) return;

  const lines = normalized.split("\n");
  let listType: "ul" | "ol" | "" = "";
  let listEl: HTMLUListElement | HTMLOListElement | null = null;

  const closeList = () => {
    if (listEl) {
      container.append(listEl);
    }
    listType = "";
    listEl = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);

    if (bullet) {
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        listEl = document.createElement("ul");
      }
      const li = document.createElement("li");
      appendInlineMarkdown(li, bullet[1]);
      listEl!.append(li);
      continue;
    }

    if (numbered) {
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        listEl = document.createElement("ol");
      }
      const li = document.createElement("li");
      if (numbered[1] !== String((listEl!.children.length || 0) + 1)) {
        li.setAttribute("value", numbered[1]);
      }
      appendInlineMarkdown(li, numbered[2]);
      listEl!.append(li);
      continue;
    }

    closeList();
    const paragraph = document.createElement("p");
    appendInlineMarkdown(paragraph, line);
    container.append(paragraph);
  }

  closeList();
}
