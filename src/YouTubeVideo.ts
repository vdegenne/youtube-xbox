export const PlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,
} as const

export class YouTubeVideo {
	static getVideoId() {
		var urlParams = new URLSearchParams(window.location.search)
		return urlParams.get('v')
	}
	static timeupdateSet = false
	static #lastSave = 0
	static get videoElement() {
		const video = document.querySelector<HTMLVideoElement>('video')
		if (!video) {
			throw new Error('no video found.')
		}
		if (!this.timeupdateSet) {
			video.addEventListener('timeupdate', () => {
				const now = Date.now()
				if (now - this.#lastSave > 5000) {
					// save every 5 seconds
					const id = this.getVideoId()
					if (id) {
						const d = JSON.parse(localStorage.getItem('youtube-xbox') ?? '{}')
						d[id] = this.videoElement.currentTime
						localStorage.setItem('youtube-xbox', JSON.stringify(d))
					}
					this.#lastSave = now
				}
			})
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
		if (this.isPlaying) {
			this.pauseVideo()
		} else {
			this.playVideo()
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

	static rewind(s: number) {
		this.videoElement.currentTime -= s
	}
	static fastforward(s: number) {
		this.videoElement.currentTime += s
	}

	static decreaseSpeed(rate = 0.25) {
		this.videoElement.playbackRate -= rate
	}
	static increaseSpeed(rate = 0.25) {
		this.videoElement.playbackRate += rate
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
