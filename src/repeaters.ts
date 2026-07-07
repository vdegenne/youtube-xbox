import {type Mode} from '@vdegenne/mini-gamepad'
import {Repeater} from '@vdegenne/mini-gamepad/repeater.js'
import {player} from './content.js'
import {
	leftJoystickLeftFunction,
	leftJoystickRightFunction,
	rightJoystickLeftFunction,
	rightJoystickRightFunction,
} from './functions.js'
import {toast} from './snackbar.js'

export const JoyRepetiters = {
	leftleft: new Repeater<[Mode]>({
		repeatTimeoutMs: 300,
		speedMs: 70,
		action: leftJoystickLeftFunction,
	}),
	leftright: new Repeater<[Mode]>({
		repeatTimeoutMs: 300,
		speedMs: 70,
		action: leftJoystickRightFunction,
	}),
	rightleft: new Repeater<[Mode]>({action: rightJoystickLeftFunction}),
	rightright: new Repeater<[Mode]>({action: rightJoystickRightFunction}),
}

export const dpadRepeaters = {
	left: new Repeater({
		speedMs: 100,
		action() {
			player.oneFrameBack()
		},
	}),
	right: new Repeater({
		speedMs: 100,
		action() {
			player.oneFrameForward()
		},
	}),
	up: new Repeater({
		action() {
			const newVolume = player.volumeUp()
			if (newVolume !== undefined) {
				toast(newVolume)
			}
		},
	}),
	down: new Repeater({
		action() {
			const newVolume = player.volumeDown()
			if (newVolume !== undefined) {
				toast(newVolume)
			}
		},
	}),
}
