import './common.js';
import {trophies} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';
import * as auth from './modules/auth.js';

let elemOutputCSSClass = document.getElementById("output-css-class");
let elemOutputCSSText = document.getElementById("output-css-text");
let elemCopyCSSClass = document.getElementById("output-css-class-copy");
let elemCopyCSSText = document.getElementById("output-css-text-copy");

(async function main() {
	if (localStorage.getItem("refreshToken")) {
		let reddit = await auth.getReddit();
		let flair = await reddit.getSubreddit("SquareWheel").fetch().getUserFlair("SquareWheel");
		console.log(flair.flair_text);
	}
})();

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
	elemOutputCSSText.value = flairText;
	elemOutputCSSClass.value = flairClass;

	// Enable Copy buttons if code isn't empty
	elemCopyCSSText.disabled = !flairText;
	elemCopyCSSClass.disabled = !flairClass;
}

function setupEventListeners() {
	// Select whole code output on focus
	elemOutputCSSText.addEventListener("focus", () => elemOutputCSSText.select());
	elemOutputCSSClass.addEventListener("focus", () => elemOutputCSSClass.select());

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
