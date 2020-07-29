import {trophies} from '../../config.js';

export function generateOld() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += trophy.oldCode;
		}
	});

	return code;
}

export function generateNew() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += trophy.newCode;
		}
	});

	return code;
}
