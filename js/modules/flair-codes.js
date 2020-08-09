import {trophies} from '../../config.js';

export function generateOld() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += trophy.oldCode;
		}
	});

	if (code) { // Append trailing T if any selections were entered
		code += "T";
	}

	return code;
}

export function generateNew() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += ":" + trophy.newCode + ":";
		}
	});

	return code;
}
