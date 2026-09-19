export function setZoomFn(zoomNum: number) {
  // credit to code here: https://github.com/mrwoof/google-docs-zoom-extension/blob/main/content.js

  const TARGET_ZOOM_TEXT = `${zoomNum}%`
  const MAX_ATTEMPTS = 30
  const RETRY_MS = 500
  const MENU_OPEN_DELAY_MS = 150

  function simulateClick(el) {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    for (const type of ["mouseover", "mousedown", "mouseup", "click"]) {
      el.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: cx,
          clientY: cy,
          button: 0
        })
      )
    }
  }

  function getZoomCombobox() {
    return document.querySelector(".docs-toolbar-zoom-combobox")
  }

  function isAlreadyAtTarget(combobox) {
    const caption = combobox.querySelector(".goog-toolbar-combo-button-caption")
    return (
      caption &&
      caption.getAttribute("aria-label") ===
        `Zoom list. ${TARGET_ZOOM_TEXT} selected.`
    )
  }

  function findVisibleMenuItem(text) {
    const menu = Array.from(document.querySelectorAll(".goog-menu")).find(
      (m: any) => m.offsetParent !== null
    )
    if (!menu) return null
    return (
      Array.from(menu.querySelectorAll(".goog-menuitem")).find(
        (el: any) => el.textContent.trim() === text
      ) || null
    )
  }

  // Google's zoom control (docs-toolbar-zoom-combobox) is a Closure combobox
  // that mounts asynchronously, so retry until the toolbar and menu are ready.
  function trySetZoom(attemptsLeft) {
    const combobox = getZoomCombobox()
    if (!combobox) {
      if (attemptsLeft > 0)
        setTimeout(() => trySetZoom(attemptsLeft - 1), RETRY_MS)
      return
    }
    if (isAlreadyAtTarget(combobox)) return

    simulateClick(combobox)

    setTimeout(() => {
      const item = findVisibleMenuItem(TARGET_ZOOM_TEXT)
      if (item) {
        simulateClick(item)
      } else if (attemptsLeft > 0) {
        setTimeout(() => trySetZoom(attemptsLeft - 1), RETRY_MS)
      }
    }, MENU_OPEN_DELAY_MS)
  }

  trySetZoom(MAX_ATTEMPTS)
}
