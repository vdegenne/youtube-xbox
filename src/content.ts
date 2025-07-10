import {MiniGamepad, Mode} from '@vdegenne/mini-gamepad'
import {YouTubeVideo} from './YouTubeVideo.js'

const minigp = new MiniGamepad({
	backgroundActivity: true,
})

minigp.onConnect((gp) => {
	const btn = gp.mapping

	gp.for(btn.L1).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.toggleVideo()
				break
		}
	})

	gp.for(btn.LEFT_STICK_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.rewind()
				break
		}
	})
	gp.for(btn.LEFT_STICK_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.fastforward()
				break
		}
	})

	gp.for(btn.LEFT_BUTTONS_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				// YouTubeVideo.rewind(1 / 60)
				YouTubeVideo.oneFrameBack()
				break
		}
	})
	gp.for(btn.LEFT_BUTTONS_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				// YouTubeVideo.fastforward(1 / 60)
				YouTubeVideo.oneFrameForward()
				break
		}
	})

	gp.for(btn.MIDDLE_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.toggleControls()
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.fullscreen()
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_BOTTOM).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				try {
					document.exitFullscreen()
				} catch {}
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.resumeLive()
				break
		}
	})

	gp.for(btn.RIGHT_STICK_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.decreaseSpeed()
				break
		}
	})

	gp.for(btn.RIGHT_STICK_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.increaseSpeed()
				break
		}
	})
})

import {Debouncer} from '@vdegenne/debouncer'

function saveTime() {
	const id = YouTubeVideo.getVideoId()
	if (id) {
		const d = JSON.parse(localStorage.getItem('youtube-xbox') ?? '{}')
		d[id] = YouTubeVideo.videoElement.currentTime
		localStorage.setItem('youtube-xbox', JSON.stringify(d))
		console.log('/////////////////////////////////// ', d[id])
	}
}
const saveTimeDebouncer = new Debouncer(saveTime, 100)
function loadTime() {
	const id = YouTubeVideo.getVideoId()
	if (id) {
		const d = JSON.parse(localStorage.getItem('youtube-xbox') ?? '{}')
		if (d[id]) {
			console.log('==========================================', d[id])
			YouTubeVideo.videoElement.currentTime = d[id]
		}
	}
}
// let lastSave = 0
// YouTubeVideo.waitUntilVideoIsAvailable().then(async () => {
// 	await new Promise((r) => setTimeout(r, 2000))
// 	loadTime()
// 	YouTubeVideo.videoElement.addEventListener('timeupdate', () => {
// 		const now = Date.now()
// 		if (now - lastSave > 1000) {
// 			saveTimeDebouncer.call()
// 			lastSave = now
// 		}
// 	})
// 	YouTubeVideo.videoElement.addEventListener('click', () => {
// 		saveTimeDebouncer.call()
// 	})
// })
