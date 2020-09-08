import {trophies, variants} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';
import * as auth from './modules/auth.js';
import * as subPrefs from './modules/sub-preferences.js';

const elemTrophyList = document.getElementById("trophy-list");
const elemUser = document.getElementById("username");
const elemBtnExport = document.getElementById("btn-export");
const elemOutputCSSText = document.getElementById("output-css-text");
const elemOutputCSSClass = document.getElementById("output-css-class");
const elemCopyCSSText = document.getElementById("output-css-text-copy");
const elemCopyCSSClass = document.getElementById("output-css-class-copy");

createTrophyList();
prepareInputButton();
wireButtons();

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
function prepareInputButton() {
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
	// Disable everything while loading
	event.preventDefault(); // Stop form from firing
	elemBtnExport.disabled = true;
	elemTrophyList.classList.add("disable-click");
	emptyTrophyButtonState();

	// Get data
	const importSub = subPrefs.getImport();
	const reddit = await auth.getReddit();

	// Verify username
	const username = getUsername();
	if (!username) {
		console.log("Username is not valid");
		return;
	}

	try {
		// Check user exists and get flair simultaneously
		const userPromise = reddit.getUser(username).fetch();
		const flairPromise = reddit.getSubreddit(importSub).getUserFlair(username);
		const values = await Promise.all([userPromise, flairPromise]);
		const flair = values[1];

		// Update state
		elemBtnExport.disabled = false;
		elemTrophyList.classList.remove("disable-click");
		const state = flairCodes.parseFlairIntoStates(flair.flair_text);
		setTrophyButtonState(state);
	}
	catch {
		console.log("User does not exist");
	}
}

async function btnExportClicked() {
	elemBtnExport.disabled = true;
	elemBtnExport.textContent = "Exporting...";

	const flairText = elemOutputCSSText.value;
	const flairClass = elemOutputCSSClass.value;
	const username = getUsername();

	// Update flair data
	const exportSubs = subPrefs.getExport();
	const reddit = await auth.getReddit();
	for (const sub of exportSubs) {
		await reddit.getUser(username).assignFlair({subredditName: sub, text: flairText, cssClass: flairClass});
	}

	// Re-enable buttons
	elemBtnExport.disabled = false;
	elemBtnExport.textContent = "Exported!";
	setTimeout(() => {
		elemBtnExport.textContent = "Export";
	}, 1500);
}

// Gets username from input field
// Strips userpage URL and /u/ if present
function getUsername() {
	let username = elemUser.value;
	let re = new RegExp('(user/|u/)?([a-zA-Z0-9\_\-]+)/?$');
	let match = re.exec(username);

	if (match) {
		return match[2];
	}

	return null;
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

function wireButtons() {
	listenerImport();
	listenerExport();
	listenerExportFocus();
	listenerBtnCopy();
	listenerConnect();
}

function listenerImport() {
	const elemBtnImport = document.getElementById("btn-import");

	// Enable Import and Export buttons if username present
	elemUser.addEventListener("input", () => {
		elemBtnImport.disabled = !elemUser.value;
		elemBtnExport.disabled = !elemUser.value;
	});

	elemBtnImport.addEventListener("click", btnImportClicked);
}

function listenerExport() {
	elemBtnExport.addEventListener("click", btnExportClicked);
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

function listenerConnect() {
	if (!localStorage.getItem("refreshToken")) {
		let btnConnect = document.getElementById("btn-connect");
		btnConnect.disabled = false;
		btnConnect.addEventListener("click", auth.buttonConnect);
	}
}
