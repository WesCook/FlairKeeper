import './common.js';
import {trophies} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';

let elemOutputCSSClass = document.getElementById("output-css-class");
let elemOutputCSSText = document.getElementById("output-css-text");
let elemCopyCSSClass = document.getElementById("output-css-class-copy");
let elemCopyCSSText = document.getElementById("output-css-text-copy");

createTrophyList();
setupEventListeners();

function createTrophyList() {
	let elemTrophyList = document.getElementById("trophy-list");
	elemTrophyList.innerHTML = "";
	trophies.forEach(trophy => {
		let figure = document.createElement("figure");
		let img = document.createElement("img");
		let figcaption = document.createElement("figcaption");

		figure.classList.add("trophy");
		figure.id = trophy.id;
		figure.dataset.unlocked = 0;
		img.src = trophy.variants["Main"].icon;
		img.alt = trophy.name;
		figcaption.textContent = trophy.name;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		figure.addEventListener("click", toggleTrophy);
		elemTrophyList.appendChild(figure);
	});
}

function toggleTrophy() {
	this.dataset.unlocked ^= true;
	updateFlairCodes();
}

function updateFlairCodes() {
	let flairClass = flairCodes.generateCSSText();
	let flairText = flairCodes.generateCSSClass();

	// Update text boxes values
	elemOutputCSSClass.value = flairClass;
	elemOutputCSSText.value = flairText;

	// Enable Copy buttons if code isn't empty
	elemCopyCSSClass.disabled = !flairClass;
	elemCopyCSSText.disabled = !flairText;
}

function setupEventListeners() {
	// Select whole code output on focus
	elemOutputCSSClass.addEventListener("focus", () => {
		elemOutputCSSClass.select();
	});

	elemOutputCSSText.addEventListener("focus", () => {
		elemOutputCSSText.select();
	});


	// Detect clicks on Copy
	elemCopyCSSClass.addEventListener("click", () => {
		clipboard.copy(elemOutputCSSClass.value);
		clipboard.displayCopied(elemCopyCSSClass);
	});

	elemCopyCSSText.addEventListener("click", () => {
		clipboard.copy(elemOutputCSSText.value);
		clipboard.displayCopied(elemCopyCSSText);
	});
}
