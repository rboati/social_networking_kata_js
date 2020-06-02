import assert from 'assert';

function englishPlural(number, singular, plural=null) {
	if (plural === null) {
		plural = singular + 's';
	}
	if (number === 1) {
		return singular;
	} else {
		return plural;
	}
}


export function humanElapsedTime(dateObjectThen, dateObjectNow) {
	assert(dateObjectThen instanceof Date);
	assert(dateObjectNow instanceof Date);
	assert(dateObjectNow >=	dateObjectThen);

	const SEC_PER_MINUTE = 60;
	const   SEC_PER_HOUR = 60 * 60;
	const    SEC_PER_DAY = 60 * 60 * 24;
	const  SEC_PER_MONTH = 60 * 60 * 24 * 30;
	const   SEC_PER_YEAR = 60 * 60 * 24 * 365;

	const deltaSeconds = (dateObjectNow - dateObjectThen) / 1000;
	let delta = 0;

	if (deltaSeconds < SEC_PER_MINUTE) {
		delta = Math.floor(deltaSeconds);
		return `${delta} ${englishPlural(delta, "second")} ago`;
	} else if (deltaSeconds < SEC_PER_HOUR) {
		delta = Math.floor(deltaSeconds / SEC_PER_MINUTE);
		return `${delta} ${englishPlural(delta, "minute")} ago`;
	} else if (deltaSeconds < SEC_PER_DAY) {
		delta = Math.floor(deltaSeconds / SEC_PER_HOUR);
		return `${delta} ${englishPlural(delta, "hour")} ago`;
	} else if (deltaSeconds < SEC_PER_MONTH) {
		delta = Math.floor(deltaSeconds / SEC_PER_DAY);
		return `${delta} ${englishPlural(delta, "day")} ago`;
	} else if (deltaSeconds < SEC_PER_YEAR) {
		delta = Math.floor(deltaSeconds / SEC_PER_MONTH);
		return `${delta} ${englishPlural(delta, "month")} ago`;
	} else {
		delta = Math.floor(deltaSeconds / SEC_PER_YEAR);
		return `${englishPlural(delta, "year")} ago`;
	}
}

