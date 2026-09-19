function setZoom(zoom: number) {
    const zoomControl = document.querySelector<HTMLElement>("#t-zoom")

    if (!zoomControl) {
        console.error("Zoom control not found")
        return
    }

    zoomControl.click()

    setTimeout(() => {
        console.log('Setting zoom to', zoom, '%');
        const options = [
            ...document.querySelectorAll<HTMLElement>('[role="option"]')
        ]

        const option = options.find(
            (el) => el.getAttribute("aria-label") === `${zoom}%`
        )

        if (!option) {
            console.error(`Zoom option ${zoom}% not found`)
            return
        }

        option.click()
    }, 100)
}

setZoom(125)