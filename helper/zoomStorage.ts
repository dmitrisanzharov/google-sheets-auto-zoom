export const SHEET_ZOOM_STORAGE_KEY = "dmitri-google-sheets-zoom"

export type GoogleSheetZoomEntry = {
  googleSheetId: string
  zoomSet: number
}

export function getGoogleSheetIdFromUrl(url?: string): string | null {
  if (!url) return null

  const match = url.match(/\/spreadsheets\/d\/([A-Za-z0-9-_]+)/i)
  return match ? match[1] : null
}

export function getStoredSheetZoomEntries(): Promise<GoogleSheetZoomEntry[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(SHEET_ZOOM_STORAGE_KEY, (result) => {
      const value = result[SHEET_ZOOM_STORAGE_KEY]
      resolve(Array.isArray(value) ? value : [])
    })
  })
}

export async function getSavedZoomForSheet(
  googleSheetId: string
): Promise<number | null> {
  const entries = await getStoredSheetZoomEntries()
  const match = entries.find((entry) => entry.googleSheetId === googleSheetId)
  return match ? match.zoomSet : null
}

export function setStoredSheetZoomEntry(
  googleSheetId: string,
  zoomSet: number
): Promise<void> {
  return new Promise((resolve) => {
    getStoredSheetZoomEntries().then((entries) => {
      const nextEntries = entries.filter(
        (entry) => entry.googleSheetId !== googleSheetId
      )

      nextEntries.push({ googleSheetId, zoomSet })

      chrome.storage.local.set(
        {
          [SHEET_ZOOM_STORAGE_KEY]: nextEntries
        },
        () => resolve()
      )
    })
  })
}
