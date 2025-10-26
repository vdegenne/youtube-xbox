export function toast(input: string | number) {
	const containerId = '__custom_snackbar_container'
	let container = document.getElementById(containerId)

	if (!container) {
		container = document.createElement('div')
		container.id = containerId
		Object.assign(container.style, {
			position: 'fixed',
			bottom: '10px',
			left: '10px',
			display: 'flex',
			flexDirection: 'column',
			gap: '5px',
			zIndex: '99999',
			pointerEvents: 'none',
		})
		document.body.appendChild(container)
	}

	const message = document.createElement('div')
	message.textContent = `${input}`
	Object.assign(message.style, {
		background: 'rgba(0,0,0,0.7)',
		color: 'white',
		padding: '6px 12px',
		borderRadius: '4px',
		fontSize: '16px', // bigger text
		pointerEvents: 'auto',
		opacity: '0',
		transition: 'opacity 0.2s',
	})

	container.appendChild(message)
	requestAnimationFrame(() => (message.style.opacity = '1'))

	setTimeout(() => {
		message.style.opacity = '0'
		message.addEventListener('transitionend', () => message.remove(), {
			once: true,
		})
	}, 2000)
}
