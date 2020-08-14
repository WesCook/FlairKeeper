import {trophies} from '../../config.js';

export function generateCSSText() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += trophy.variants["Main"].css_text;
		}
	});

	if (code) { // Append trailing T if any selections were entered
		code += "T";
	}

	return code;
}

export function generateCSSClass() {
	let code = "";

	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			code += ":" + trophy.variants["Main"].css_class + ":";
		}
	});

	return code;
}
