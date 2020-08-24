import {trophies} from '../../config.js';

export function generateCSSText() {
	let code = "";

	trophies.forEach(trophy => {
		const elemTrophy = document.getElementById(trophy.id);
		const state = elemTrophy.dataset.state;

		if (state !== "0") {
			code += trophy.variants[state].css_text;
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
		const elemTrophy = document.getElementById(trophy.id);
		const state = elemTrophy.dataset.state;

		if (state !== "0") {
			code += ":" + trophy.variants[state].css_class + ":";
		}
	});

	return code;
}
