import {getElement} from 'html-vision'
export const PlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,
} as const

export class YouTubeVideo {
	static videoSelector = 'video'
	static waitUntilVideoIsAvailable() {
		return getElement(this.videoSelector, {timeoutMs: -1})
	}
	static getVideoId() {
		var urlParams = new URLSearchParams(window.location.search)
		return urlParams.get('v')
	}
	static get videoElement() {
		const video = document.querySelector<HTMLVideoElement>('video')
		if (!video) {
			throw new Error('no video found.')
		}
		return video
	}

	static get isPlaying() {
		return !this.videoElement.paused
	}
	static playVideo() {
		this.videoElement.play()
	}
	static pauseVideo() {
		this.videoElement.pause()
	}
	static toggleVideo() {
		document.querySelector<HTMLElement>('.ytp-play-button')?.click()
		return
		if (this.isPlaying) {
			this.pauseVideo()
		} else {
			this.playVideo()
		}
	}
	static resumeLive() {
		const liveBadge = document.querySelector<HTMLElement>('.ytp-live-badge')
		if (liveBadge) {
			if (!liveBadge.classList.contains('ytp-live-badge-is-livehead')) {
				liveBadge.click()
			}
		}
	}

	static get hidablePlayerElements() {
		const moviePlayer = document.querySelector('#movie_player')
		if (moviePlayer) {
			return moviePlayer.querySelectorAll<HTMLElement>(
				'.ytp-chrome-bottom, .ytp-gradient-bottom, .ytp-player-content, .ytp-gradient-top, .ytp-chrome-top',
			)
		}
		return []
	}

	static #areControlsVisible = true
	static hideControls() {
		this.hidablePlayerElements.forEach((el) => (el.style.visibility = 'hidden'))
	}
	static showControls() {
		this.hidablePlayerElements.forEach(
			(el) => (el.style.visibility = 'initial'),
		)
	}
	static toggleControls() {
		if (this.#areControlsVisible) {
			this.hideControls()
			this.#areControlsVisible = false
		} else {
			this.showControls()
			this.#areControlsVisible = true
		}
	}

	static rewind(s?: number) {
		if (s === undefined) {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'ArrowLeft',
					code: 'ArrowLeft',
					keyCode: 37,
					bubbles: true,
					cancelable: true,
				}),
			)
		} else {
			this.videoElement.currentTime -= s
		}
	}
	static fastforward(s?: number) {
		if (s === undefined) {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'ArrowRight',
					code: 'ArrowRight',
					keyCode: 39,
					bubbles: true,
					cancelable: true,
				}),
			)
		} else {
			this.videoElement.currentTime += s
		}
	}
	static oneFrameBack() {
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: ',',
				code: 'Comma',
				keyCode: 188,
				bubbles: true,
				cancelable: true,
			}),
		)
	}
	static oneFrameForward() {
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: '.',
				code: 'Period',
				keyCode: 190,
				bubbles: true,
				cancelable: true,
			}),
		)
	}

	static decreaseSpeed(rate?: number) {
		if (rate === undefined) {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: '<',
					code: 'Comma',
					keyCode: 188,
					shiftKey: true,
					bubbles: true,
					cancelable: true,
				}),
			)
		} else {
			this.videoElement.playbackRate -= rate
		}
	}
	static increaseSpeed(rate?: number) {
		if (rate === undefined) {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: '>',
					code: 'Period',
					keyCode: 190,
					shiftKey: true,
					bubbles: true,
					cancelable: true,
				}),
			)
		} else {
			this.videoElement.playbackRate += rate
		}
	}

	static fullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen()
		} else {
			// this.videoElement.requestFullscreen()
			document.querySelector<HTMLElement>('.ytp-fullscreen-button')?.click()
		}
	}
}

// player()?.addEventListener('onStateChange', (event) => {
// 	const state = event as unknown as YT.PlayerState // Weird: but on YT Web version the state value is directly the event itself
// 	if (state !== PlayerState.BUFFERING) {
// 		lastState = state
// 	}
// })
