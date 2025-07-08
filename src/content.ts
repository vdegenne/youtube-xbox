import toast from 'toastit'
import {MiniGamepad, Mode} from '@vdegenne/mini-gamepad'

export const PlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,
} as const

export type PlayerState = (typeof PlayerState)[keyof typeof PlayerState]

const minigp = new MiniGamepad({})

let lastState: YT.PlayerState = PlayerState.UNSTARTED

interface YTPlayerElement extends HTMLElement {
	player_: YTPlayer
}

let areControlsVisible = true

interface YTPlayer extends YT.Player {
	hideControls(): void
	showControls(): void
}

function video() {
	return document.querySelector<YTPlayerElement>('ytd-player')
}
function player() {
	return video()?.player_
}
function isPlaying() {
	const state = player()?.getPlayerState()
	if (state === PlayerState.UNSTARTED) {
		return false
	}
	return (
		state === PlayerState.PLAYING ||
		(state === PlayerState.BUFFERING && lastState === PlayerState.PAUSED)
	)
}

minigp.onConnect((gp) => {
	console.log(player())
	player()?.addEventListener('onStateChange', (event) => {
		const state = event as unknown as YT.PlayerState // Weird: but on YT Web version the state value is directly the event itself
		if (state !== PlayerState.BUFFERING) {
			lastState = state
		}
	})
	const btn = gp.mapping

	gp.for(btn.L1).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				if (isPlaying()) {
					player()?.pauseVideo()
				} else {
					player()?.playVideo()
				}
				break
		}
	})

	gp.for(btn.MIDDLE_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				if (areControlsVisible) {
					player()?.hideControls()
					areControlsVisible = false
				} else {
					player()?.showControls()
					areControlsVisible = true
				}
				break
		}
	})
})
