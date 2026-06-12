/* CONTRACT: + attachment menu for product/lab chat composer — open/close, file pick, camera. */

export type ChatAttachmentMenuElements = {
  attachLayer: HTMLElement;
  attachBtn: HTMLButtonElement;
  attachMenu: HTMLElement;
  attachBackdrop: HTMLElement;
  attachCameraBtn: HTMLButtonElement;
  attachPickBtn: HTMLButtonElement;
  fileInput: HTMLInputElement;
  composeStack: HTMLElement;
  /** CSS custom property for mobile sheet offset from viewport bottom. */
  sheetBottomVar?: string;
  sheetMenuClass?: string;
};

export type ChatAttachmentMenuCallbacks = {
  onFileSelected: (file: File) => void;
};

export function initChatAttachmentMenu(
  elements: ChatAttachmentMenuElements,
  callbacks: ChatAttachmentMenuCallbacks,
): void {
  const {
    attachLayer,
    attachBtn,
    attachMenu,
    attachBackdrop,
    attachCameraBtn,
    attachPickBtn,
    fileInput,
    composeStack,
    sheetBottomVar = "--viddel-chat-attach-sheet-bottom",
    sheetMenuClass = "viddel-chat-attach__menu--sheet",
  } = elements;

  if (attachLayer.parentElement !== document.body) {
    document.body.appendChild(attachLayer);
  }

  let attachMenuOpen = false;
  let attachOutsideCloseReady = false;

  const isMobileAttachMenu = () => window.matchMedia("(max-width: 639px)").matches;

  const resetAttachMenuInlineStyles = () => {
    attachMenu.style.left = "";
    attachMenu.style.top = "";
    attachMenu.style.bottom = "";
    attachMenu.style.right = "";
    attachMenu.style.transform = "";
    attachMenu.style.width = "";
  };

  const syncMobileAttachSheetPosition = () => {
    const composeRect = composeStack.getBoundingClientRect();
    const sheetBottom = Math.ceil(window.innerHeight - composeRect.top + 12);
    document.documentElement.style.setProperty(sheetBottomVar, `${sheetBottom}px`);
  };

  const positionAttachMenu = () => {
    resetAttachMenuInlineStyles();
    attachMenu.classList.toggle(sheetMenuClass, isMobileAttachMenu());

    if (isMobileAttachMenu()) {
      syncMobileAttachSheetPosition();
      return;
    }

    document.documentElement.style.removeProperty(sheetBottomVar);
    const rect = attachBtn.getBoundingClientRect();
    const menuWidth = attachMenu.offsetWidth || 168;
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - menuWidth - 12);
    const top = rect.top - attachMenu.offsetHeight - 8;
    attachMenu.style.left = `${left}px`;
    attachMenu.style.top = `${Math.max(12, top)}px`;
  };

  const closeAttachMenu = () => {
    if (!attachMenuOpen) return;
    attachMenuOpen = false;
    attachOutsideCloseReady = false;
    attachLayer.classList.add("hidden");
    attachMenu.classList.add("hidden");
    attachMenu.classList.remove(sheetMenuClass);
    attachBackdrop.classList.add("hidden");
    attachBtn.setAttribute("aria-expanded", "false");
    resetAttachMenuInlineStyles();
    document.documentElement.style.removeProperty(sheetBottomVar);
  };

  const openAttachMenu = () => {
    attachMenuOpen = true;
    attachOutsideCloseReady = false;
    positionAttachMenu();
    attachLayer.classList.remove("hidden");
    attachMenu.classList.remove("hidden");
    attachBackdrop.classList.remove("hidden");
    attachBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      positionAttachMenu();
      window.setTimeout(() => {
        attachOutsideCloseReady = true;
      }, 120);
    });
  };

  const openFilePicker = (mode: "camera" | "pick") => {
    closeAttachMenu();
    if (mode === "camera") {
      fileInput.setAttribute("capture", "environment");
    } else {
      fileInput.removeAttribute("capture");
    }
    fileInput.value = "";
    fileInput.click();
  };

  const toggleAttachMenu = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (attachMenuOpen) {
      closeAttachMenu();
      return;
    }
    openAttachMenu();
  };

  attachBtn.addEventListener("click", toggleAttachMenu);

  attachCameraBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openFilePicker("camera");
  });

  attachPickBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openFilePicker("pick");
  });

  attachBackdrop.addEventListener("click", closeAttachMenu);

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!attachMenuOpen || !attachOutsideCloseReady) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (attachBtn.contains(target)) return;
      if (attachMenu.contains(target)) return;
      closeAttachMenu();
    },
    true,
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAttachMenu();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    callbacks.onFileSelected(file);
  });

  window.addEventListener(
    "resize",
    () => {
      if (attachMenuOpen) positionAttachMenu();
    },
    { passive: true },
  );
}
