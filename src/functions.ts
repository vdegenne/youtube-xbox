import {Mode} from '@vdegenne/mini-gamepad'
import {pyserver} from '@vdegenne/py-server'
import {player} from './content.js'
import {toast} from './snackbar.js'

export function leftJoystickLeftFunction(mode: Mode) {
	switch (mode) {
		case Mode.NORMAL:
			if (player.rewind(4) !== undefined) {
				toast('-4')
			}
			break
		case Mode.PRIMARY:
			// YouTubeVideo.rewind(12)
			player.rewind()
			player.rewind()
			break
	}
}
export function leftJoystickRightFunction(mode: Mode) {
	switch (mode) {
		case Mode.NORMAL:
			if (player.fastforward(4) !== undefined) {
				toast('+4')
			}
			break
		case Mode.PRIMARY:
			player.fastforward()
			player.fastforward()
			break
	}
}

export function rightJoystickLeftFunction(mode: Mode) {
	switch (mode) {
		case Mode.NORMAL:
			pyserver.post('ydotool', {input: '29:1 105:1 105:0 29:0'})
			break
	}
}
export function rightJoystickRightFunction(mode: Mode) {
	switch (mode) {
		case Mode.NORMAL:
			pyserver.post('ydotool', {input: '29:1 106:1 106:0 29:0'})
			break
	}
}
