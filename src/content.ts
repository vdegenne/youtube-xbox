import {MiniGamepad, Mode} from '@vdegenne/mini-gamepad'
import {YouTubeVideo} from './YouTubeVideo.js'

const minigp = new MiniGamepad({})

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
				YouTubeVideo.rewind(3)
				break
		}
	})
	gp.for(btn.LEFT_STICK_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.fastforward(3)
				break
		}
	})

	gp.for(btn.LEFT_BUTTONS_LEFT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.rewind(1 / 60)
				break
		}
	})
	gp.for(btn.LEFT_BUTTONS_RIGHT).before(({mode}) => {
		switch (mode) {
			case Mode.NORMAL:
				YouTubeVideo.fastforward(1 / 60)
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
})
