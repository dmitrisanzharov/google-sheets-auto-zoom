import { setZoomFn } from "./helper/setZoomFn";
import {
  getGoogleSheetIdFromUrl,
  getSavedZoomForSheet
} from "./helper/zoomStorage";
import { DEFAULT_ZOOM } from "./constants";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "set-zoom" && typeof message.zoom === "number") {
    setZoomFn(message.zoom);
    sendResponse({ ok: true });
  }

  return true;
});

const googleSheetId = getGoogleSheetIdFromUrl(window.location.href)

if (googleSheetId) {
  getSavedZoomForSheet(googleSheetId).then((zoom) => {
    setZoomFn(zoom ?? DEFAULT_ZOOM)
  })
} else {
  setZoomFn(DEFAULT_ZOOM)
}