import {Debouncer} from '@vdegenne/debouncer'
import {MiniGamepad, Mode} from '@vdegenne/mini-gamepad'
import {
	getVideoId,
	getVisibleYouTubeVideo,
	isShorts,
	nextShort,
	previousShort,
	waitUntilVideoIsAvailable,
} from '@vdegenne/youtube/functions.js'
import {YouTubePlayer} from '@vdegenne/youtube/player.js'
import {getElement} from 'html-vision'
import './prevent-alt-arrows.js'
import {dpadRepeaters, JoyRepetiters} from './repeaters.js'
import {toast} from './snackbar.js'

export const player = new YouTubePlayer(getVisibleYouTubeVideo)

const minigp = new MiniGamepad({
	backgroundActivity: false,
})

minigp.onConnect((gp) => {
	window.addEventListener('youtube-xbox:on', () => {
		gp.enabled = false
	})
	window.addEventListener('youtube-xbox:off', () => {
		gp.enabled = true
	})
	const btn = gp.mapping

	gp.for(btn.L1).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.togglePlay()
				break
		}
	})

	gp.for(btn.R1).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.toggleSubtitles()
				break
		}
	})

	gp.for(btn.LEFT_STICK_PRESS).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				// YouTubeVideo.toggleSubtitles()
				break
		}
	})

	gp.for(btn.LEFT_STICK_LEFT)
		.before(({mode}) => {
			JoyRepetiters.leftleft.start(mode)
		})
		.after(() => {
			JoyRepetiters.leftleft.stop()
		})

	gp.for(btn.LEFT_STICK_RIGHT)
		.before(({mode}) => {
			JoyRepetiters.leftright.start(mode)
		})
		.after(() => {
			JoyRepetiters.leftright.stop()
		})

	gp.for(btn.LEFT_BUTTONS_LEFT)
		.before(({mode}) => {
			switch (mode) {
				case Mode.NORMAL:
					dpadRepeaters.left.start()
					break
				case Mode.PRIMARY:
					const newSpeed = player.decreaseSpeed()
					if (newSpeed !== undefined) {
						toast(newSpeed)
					}
					break
			}
		})
		.after(() => {
			dpadRepeaters.left.stop()
		})
	gp.for(btn.LEFT_BUTTONS_RIGHT)
		.before(({mode}) => {
			switch (mode) {
				case Mode.NORMAL:
					dpadRepeaters.right.start()
					break
				case Mode.PRIMARY:
					const newSpeed = player.increaseSpeed()
					if (newSpeed !== undefined) {
						toast(newSpeed)
					}
					break
			}
		})
		.after(() => {
			dpadRepeaters.right.stop()
		})

	gp.for(btn.LEFT_BUTTONS_TOP)
		.before(async ({mode}) => {
			switch (mode) {
				case Mode.NORMAL:
					if (isShorts()) {
						previousShort()
					}
					break
				case Mode.PRIMARY:
					dpadRepeaters.up.start()
					break
			}
		})
		.after(() => {
			dpadRepeaters.up.stop()
		})

	gp.for(btn.LEFT_BUTTONS_BOTTOM)
		.before(async ({mode}) => {
			switch (mode) {
				case Mode.NORMAL:
					if (isShorts()) {
						nextShort()
					}
					break
				case Mode.PRIMARY:
					dpadRepeaters.down.start()
					break
			}
		})
		.after(() => {
			dpadRepeaters.down.stop()
		})

	gp.for(btn.MIDDLE_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.toggleControls()
				break
			case Mode.PRIMARY:
				player.toggleSubtitles()
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.fullscreen()
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_BOTTOM).before(async ({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				try {
					const exitShortsButton = await getElement(
						'#back-nav-button yt-touch-feedback-shape',
					)
					exitShortsButton.click()
					return
				} catch {}
				try {
					document.exitFullscreen()
					// player.pause()
				} catch {}
				break
		}
	})

	gp.for(btn.RIGHT_BUTTONS_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.resumeLive()
				break
		}
	})

	gp.for(btn.RIGHT_STICK_LEFT)
		.before(({mode}) => {
			JoyRepetiters.rightleft.start(mode)
		})
		.after(() => {
			JoyRepetiters.rightleft.stop()
		})

	gp.for(btn.RIGHT_STICK_RIGHT)
		.before(({mode}) => {
			JoyRepetiters.rightright.start(mode)
		})
		.after(() => {
			JoyRepetiters.rightright.stop()
		})

	gp.for(btn.RIGHT_STICK_UP).before(({mode}) => {})

	gp.for(btn.RIGHT_STICK_DOWN).before(({mode}) => {})

	gp.for(btn.RIGHT_STICK_PRESS).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				player.setSpeed(1)
				break
		}
	})
})

function saveTime() {
	const id = getVideoId()
	if (id) {
		const d = JSON.parse(localStorage.getItem('youtube-xbox') ?? '{}')
		d[id] = player.video.currentTime
		localStorage.setItem('youtube-xbox', JSON.stringify(d))
		console.log('/////////////////////////////////// ', d[id])
	}
}
const saveTimeDebouncer = new Debouncer(saveTime, 100)
function loadTime() {
	const id = getVideoId()
	if (id) {
		const d = JSON.parse(localStorage.getItem('youtube-xbox') ?? '{}')
		if (d[id]) {
			console.log('==========================================', d[id])
			player.video.currentTime = d[id]
		}
	}
}

// let lastSave = 0
waitUntilVideoIsAvailable().then(async () => {
	await new Promise((r) => setTimeout(r, 1000))
	const pauseOverlay = document.querySelector<HTMLElement>(
		'.ytp-pause-overlay-container',
	)
	console.log(pauseOverlay)
	if (pauseOverlay) {
		pauseOverlay.style.visibility = 'hidden'
	}
	// await new Promise((r) => setTimeout(r, 2000))
	// loadTime()
	// YouTubeVideo.videoElement.addEventListener('timeupdate', () => {
	// 	const now = Date.now()
	// 	if (now - lastSave > 1000) {
	// 		saveTimeDebouncer.call()
	// 		lastSave = now
	// 	}
	// })
	// YouTubeVideo.videoElement.addEventListener('click', () => {
	// 	saveTimeDebouncer.call()
	// })
})
