import {trophies, variants} from '../../config.js';

function generateCSSClass() {
	let code = "";

	trophies.forEach(trophy => {
		const elemTrophy = document.getElementById(trophy.id);
		const state = elemTrophy.dataset.state;

		if (state !== "0") {
			code += trophy.variants[state].css_class;
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
			code += ":" + trophy.variants[state].css_text + ":";
		}
	});

	return code;
}

// Expects string in the format of :text1::text2:
function parseFlairIntoStates(flairText) {
	try {
		const flairs = flairText.slice(1, -1).split("::");
		let states = {};

		trophies.forEach(trophy => {
			for (const variant of variants) {
				if (trophy.variants[variant] !== undefined && flairs.includes(trophy.variants[variant].css_text)) {
					states[trophy.id] = variant;
					return;
				}
			}
			states[trophy.id] = "0"; // Only executes if nothing found in loop
		});

		return states;
	}
	catch {
		console.log("Empty or invalid flair found.");
		return {};
	}
}

export {generateCSSClass, generateCSSText, parseFlairIntoStates};
