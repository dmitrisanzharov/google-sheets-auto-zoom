import { useEffect, useState } from "react"

import {
  getGoogleSheetIdFromUrl,
  getSavedZoomForSheet,
  setStoredSheetZoomEntry
} from "./helper/zoomStorage"

const zoomOptions = [50, 75, 90, 100, 125, 150, 200]

function IndexPopup() {
  const [activeZoom, setActiveZoom] = useState<number | null>(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      const googleSheetId = getGoogleSheetIdFromUrl(activeTab?.url)

      if (!googleSheetId) {
        return
      }

      getSavedZoomForSheet(googleSheetId).then((zoom) => {
        setActiveZoom(zoom)
      })
    })
  }, [])

  const setZoom = (zoom: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0]

      if (!activeTab?.id) {
        return
      }

      const googleSheetId = getGoogleSheetIdFromUrl(activeTab.url)

      if (!googleSheetId) {
        console.warn("Google Sheet ID not found for current tab URL:", activeTab.url)
        return
      }

      await setStoredSheetZoomEntry(googleSheetId, zoom)
      setActiveZoom(zoom)

      chrome.tabs.sendMessage(
        activeTab.id,
        {
          type: "set-zoom",
          zoom
        },
        () => {
          const error = chrome.runtime.lastError
          if (error) {
            console.warn("Failed to send zoom message:", error.message)
          }
        }
      )
    })
  }

  return (
    <div style={{ padding: 12, width: 220 }}>
      <h3 style={{ margin: "0 0 12px" }}>Google Sheets Zoom</h3>

      <div
        style={{
          marginBottom: 12,
          color: activeZoom === null ? "#6b7280" : "#111827",
          fontSize: 12,
          fontWeight: 600
        }}>
        {activeZoom === null ? "❌ Not set" : `Saved: ${activeZoom}%`}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8
        }}>
        {zoomOptions.map((value) => (
          <button
            key={value}
            onClick={() => setZoom(value)}
            style={{
              padding: "8px 0",
              border: "1px solid #d0d7de",
              borderRadius: 6,
              background: activeZoom === value ? "#e6f4ff" : "#ffffff",
              borderColor: activeZoom === value ? "#1a73e8" : "#d0d7de",
              cursor: "pointer",
              fontWeight: 600
            }}>
            {value}%
          </button>
        ))}
      </div>
    </div>
  )
}

export default IndexPopup
