import {trophies} from '../../config.js';

function generateCSSClass() {
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

function generateCSSText() {
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

// Expects string in the format of :text1::text2:
function parseFlairIntoStates(flairText) {
	const flairs = flairText.slice(1, -1).split("::");
	let states = {};

	trophies.forEach(trophy => {
		variants.every(variant => {
			if (trophy.variants[variant] !== undefined && flairs.includes(trophy.variants[variant].css_text)) {
				states[trophy.id] = true;
				return;
			}
			states[trophy.id] = false;
		});
	});

	return states;
}

export {generateCSSClass, generateCSSText, parseFlairIntoStates};
