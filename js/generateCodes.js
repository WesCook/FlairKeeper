import {trophies} from '../config.js';

export function generateCodes() {
	let flairCodeOld = "";
	let flairCodeNew = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			flairCodeOld += trophy.oldCode;
			flairCodeNew += ":" + trophy.newCode + ":";
		}
	});

	return {
		old: flairCodeOld,
		new: flairCodeNew
	};
}
