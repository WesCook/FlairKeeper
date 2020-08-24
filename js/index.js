import './common.js';
import {trophies, variants} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';
import * as auth from './modules/auth.js';
import * as subPrefs from './modules/sub-preferences.js';

const elemTrophyList = document.getElementById("trophy-list");
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
	elemTrophyList.innerHTML = "";
	trophies.forEach(trophy => {
		// Container
		let trophyContainerDiv = document.createElement("div");
		trophyContainerDiv.classList.add("trophy");
		trophyContainerDiv.id = trophy.id;
		trophyContainerDiv.dataset.state = 0;

		// Trophy figure
		let figure = document.createElement("figure");
		let img = document.createElement("img");
		let figcaption = document.createElement("figcaption");

		figure.classList.add("trophy-icon")
		img.src = trophy.variants["Main"].icon;
		img.alt = trophy.name;
		figcaption.textContent = trophy.name;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		figure.addEventListener("click", progressTrophyVariant);
		trophyContainerDiv.appendChild(figure);

		// Variant buttons
		if (variants.length > 1) {
			let variantsContainerDiv = document.createElement("div");
			variantsContainerDiv.classList.add("variants-container");

			if (Object.keys(trophy.variants).length > 1) { // Skip if "Main" is only variant
				variants.forEach(variant => {
					if (trophy.variants[variant] === undefined) {
						return;
					}

					let variantButton = document.createElement("a");
					variantButton.classList.add("variant-button");
					variantButton.textContent = variant;
					variantButton.addEventListener("click", selectTrophyVariant);
					variantsContainerDiv.appendChild(variantButton);
				});
			}
			trophyContainerDiv.appendChild(variantsContainerDiv);
		}

		elemTrophyList.appendChild(trophyContainerDiv);
	});
}

// Enables Import button if checks pass, else displays error
function importSetup() {
	if (!localStorage.getItem("refreshToken")) {
		return;
	}

	const importSub = subPrefs.getImport();
	const exportSubs = subPrefs.getExport();

	// Preferences are set, and export list is not empty
	// It's safe to enable the Import button
	if (!importSub || !exportSubs || exportSubs.length === 0) {
		document.getElementById("import-error").classList.remove("hidden");
		document.getElementById("import-tip").classList.add("hidden");
		elemUser.disabled = true;
	}
}

async function btnImportClicked() {
	const elemBtnExport = document.getElementById("btn-export");

	// Disable everything while loading
	event.preventDefault(); // Stop form from firing
	elemBtnExport.disabled = true;
	elemTrophyList.classList.add("disable-click");
	emptyTrophyButtonState();

	// Get username from URL (if necessary)
	let username = elemUser.value;
	try {
		if (username.includes("reddit.com")) {
			let re = new RegExp('reddit\.com/(user|u)/([a-zA-Z0-9\_\-]+)');
			let match = re.exec(username);
			username = match[2];
		}
	}
	catch(err) {
		console.log("Regex error when parsing username.");
		console.log(err);
	}

	// Get flair data
	const importSub = subPrefs.getImport();
	const reddit = await auth.getReddit();
	const flair = await reddit.getSubreddit(importSub).fetch().getUserFlair(username);

	// Re-enable and update trophy buttons
	elemBtnExport.disabled = false;
	elemTrophyList.classList.remove("disable-click");
	const state = flairCodes.parseFlairIntoStates(flair.flair_text);
	setTrophyButtonState(state);
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
	const elemTrophyButtons = document.querySelectorAll("#trophy-list .trophy");
	elemTrophyButtons.forEach(elemTrophyButton => {
		const state = trophyButtonState[elemTrophyButton.id];
		elemTrophyButton.dataset.state = (state) ? state : "0";
	});
	updateTrophyState();
}

function progressTrophyVariant() {
	const elemTrophy = this.parentElement;
	const trophy = trophies.find(trophy => trophy.id === elemTrophy.id)
	const availableVariants = Object.keys(trophy.variants);

	// Progress index by 1
	let currentIndex = availableVariants.findIndex(variant => variant === elemTrophy.dataset.state);
	if (currentIndex < availableVariants.length - 1) {
		currentIndex++;
		elemTrophy.dataset.state = availableVariants[currentIndex];
	} else {
		elemTrophy.dataset.state = "0";
	}

	updateTrophyState();
}

function selectTrophyVariant() {
	const elemTrophy = this.parentElement.parentElement;
	const chosenVariant = this.textContent;
	const state = elemTrophy.dataset.state;
	if (state !== chosenVariant) {
		elemTrophy.dataset.state = chosenVariant;
	} else {
		elemTrophy.dataset.state = "0";
	}
	updateTrophyState();
}

function updateTrophyState() {
	// Generate new flair codes
	const flairClass = flairCodes.generateCSSClass();
	const flairText = flairCodes.generateCSSText();

	trophies.forEach(trophy => {
		// Update icon
		const elemTrophy = document.getElementById(trophy.id);
		const elemIcon = document.querySelector("#" + trophy.id + " .trophy-icon img");
		const state = elemTrophy.dataset.state;

		if (state !== "0") {
			elemIcon.src = trophy.variants[state].icon;
		} else {
			elemIcon.src = trophy.variants["Main"].icon;
		}

		// Update selected variant button
		const elemVariantButtons = document.querySelectorAll("#" + trophy.id + " .variant-button");
		elemVariantButtons.forEach(elemVariantButton => {
			if (elemVariantButton.textContent === state) {
				elemVariantButton.classList.add("variant-selected");
			} else {
				elemVariantButton.classList.remove("variant-selected");
			}
		});
	});

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
