import { IClock } from "./clock_interface.js";

export class DefaultClock extends IClock {

	currentTime() {
		const time = new Date().getTime();
		return time;
	}

}