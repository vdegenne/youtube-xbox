import {type Mode} from '@vdegenne/mini-gamepad'
import {REPEAT_MS, RETRIGGER_TIMEOUT_MS} from './constants.js'
import {
	leftJoystickLeftFunction,
	leftJoystickRightFunction,
	rightJoystickLeftFunction,
	rightJoystickRightFunction,
} from './functions.js'

class Repetiter<T extends any[]> {
	#timeout: number | undefined
	#interval: number | undefined
	#isHeld = false

	constructor(protected callback: (...args: T) => void) {}

	#clear() {
		if (this.#timeout !== undefined) {
			clearTimeout(this.#timeout)
			this.#timeout = undefined
		}
		if (this.#interval !== undefined) {
			clearInterval(this.#interval)
			this.#interval = undefined
		}
	}

	#call(...args: T) {
		if (!this.#isHeld) {
			this.#clear()
			return
		}
		this.callback(...args)
	}

	triggerCall(...args: T) {
		this.#isHeld = true
		this.#call(...args)
		this.#clear()
		this.#timeout = setTimeout(
			() => this.#retriggerCall(...args),
			RETRIGGER_TIMEOUT_MS,
		)
	}

	releasedCall() {
		this.#isHeld = false
		this.#clear()
	}

	#retriggerCall(...args: T) {
		if (!this.#isHeld) {
			this.#clear()
			return
		}
		this.#call(...args)
		this.#clear()
		this.#interval = setInterval(() => this.#call(...args), REPEAT_MS)
	}
}

export const JoyRepetiters = {
	leftleft: new Repetiter<[Mode]>(leftJoystickLeftFunction),
	leftright: new Repetiter<[Mode]>(leftJoystickRightFunction),
	rightleft: new Repetiter<[Mode]>(rightJoystickLeftFunction),
	rightright: new Repetiter<[Mode]>(rightJoystickRightFunction),
}
