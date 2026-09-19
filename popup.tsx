const zoomOptions = [50, 75, 90, 100, 125, 150, 200]

function IndexPopup() {
  const setZoom = (zoom: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      if (!activeTab?.id) {
        return
      }

      chrome.tabs.sendMessage(activeTab.id, {
        type: "set-zoom",
        zoom
      })
    })
  }

  return (
    <div style={{ padding: 12, width: 220 }}>
      <h3 style={{ margin: "0 0 12px" }}>Google Sheets Zoom</h3>

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
              background: "#ffffff",
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
