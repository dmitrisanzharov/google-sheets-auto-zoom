import { setZoomFn } from "./helper/setZoomFn";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "set-zoom" && typeof message.zoom === "number") {
    setZoomFn(message.zoom);
    sendResponse({ ok: true });
  }

  return true;
});

setZoomFn(75);