import './common.js';
import {trophies, variants} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';
import * as auth from './modules/auth.js';
import * as subPrefs from './modules/sub-preferences.js';

const elemOutputCSSClass = document.getElementById("output-css-class");
const elemOutputCSSText = document.getElementById("output-css-text");
const elemCopyCSSClass = document.getElementById("output-css-class-copy");
const elemCopyCSSText = document.getElementById("output-css-text-copy");
const elemUser = document.getElementById("username");

createTrophyList();
importSetup();
listenerImport();
listenerExportFocus();
listenerBtnCopy();

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

// Enables Import button if checks pass, else displays error
function importSetup() {
	if (!localStorage.getItem("refreshToken")) {
		return;
	}

	let importSub = subPrefs.getImport();
	let exportSubs = subPrefs.getExport();

	// Preferences are set, and export list is not empty
	// It's safe to enable the Import button
	if (!importSub || !exportSubs || exportSubs.length === 0) {
		document.getElementById("import-error").classList.remove("hidden");
		document.getElementById("import-tip").classList.add("hidden");
		elemUser.disabled = true;
	}
}

async function btnImportClicked() {
	let elemBtnExport = document.getElementById("btn-export");

	// Disable everything while loading
	event.preventDefault(); // Stop form from firing
	elemBtnExport.disabled = true;
	emptyTrophyButtonState();

	// Get flair data
	let importSub = subPrefs.getImport();
	const reddit = await auth.getReddit();
	const flair = await reddit.getSubreddit(importSub).fetch().getUserFlair(elemUser.value);

	// Re-enable and update trophy buttons
	elemBtnExport.disabled = false;
	let state = parseFlairIntoStates(flair.flair_text);
	setTrophyButtonState(state);
}

// Expects string in the format of :text1::text2:
function parseFlairIntoStates(flairText) {
	let flairs = flairText.slice(1, -1).split("::");
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

function emptyTrophyButtonState() {
	let trophyButtonState = {};
	trophies.forEach(trophy => {
		trophyButtonState[trophy.id] = false;
	});
	setTrophyButtonState(trophyButtonState);
}

// Accepts object where keys are the trophy ID, and value is a boolean of its state
// {demonssouls: true, darksouls1: false}
function setTrophyButtonState(trophyButtonState) {
	let elemTrophyButtons = document.querySelectorAll("#trophy-list .trophy");
	elemTrophyButtons.forEach(elemTrophyButton => {
		elemTrophyButton.dataset.unlocked = (trophyButtonState[elemTrophyButton.id]) ? "1" : "0";
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

function listenerImport() {
	const elemBtnImport = document.getElementById("btn-import");
	elemUser.addEventListener("input", () => elemBtnImport.disabled = !elemUser.value); // Enable Import button if text entered
	elemBtnImport.addEventListener("click", btnImportClicked); // Call function if Import button clicked
}

// Select whole code output on focus
function listenerExportFocus() {
	elemOutputCSSText.addEventListener("focus", () => elemOutputCSSText.select());
	elemOutputCSSClass.addEventListener("focus", () => elemOutputCSSClass.select());
}

// Detect clicks on Copy
function listenerBtnCopy() {
	elemCopyCSSClass.addEventListener("click", () => {
		clipboard.copy(elemOutputCSSClass.value);
		clipboard.displayCopied(elemCopyCSSClass);
	});

	elemCopyCSSText.addEventListener("click", () => {
		clipboard.copy(elemOutputCSSText.value);
		clipboard.displayCopied(elemCopyCSSText);
	});
}
