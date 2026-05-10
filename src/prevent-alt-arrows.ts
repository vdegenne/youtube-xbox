;(function installAltArrowBlocker(): void {
	function onKeyDown(e: KeyboardEvent): void {
		const isAltArrow =
			e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')

		if (!isAltArrow) return

		// e.preventDefault()
		e.stopPropagation()
		e.stopImmediatePropagation()
	}

	document.addEventListener('keydown', onKeyDown, {capture: true})
})()
