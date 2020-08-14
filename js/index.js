import './common.js';
import {trophies} from '../config.js';
import * as clipboard from './modules/clipboard.js';
import * as flairCodes from './modules/flair-codes.js';

let elemOutputOld = document.getElementById("output-old");
let elemOutputNew = document.getElementById("output-new");
let elemCopyOld = document.getElementById("output-old-copy");
let elemCopyNew = document.getElementById("output-new-copy");

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
	let oldFlair = flairCodes.generateOld();
	let newFlair = flairCodes.generateNew();

	// Update text boxes values
	elemOutputOld.value = oldFlair;
	elemOutputNew.value = newFlair;

	// Enable Copy buttons if code isn't empty
	elemCopyOld.disabled = !oldFlair;
	elemCopyNew.disabled = !newFlair;
}

function setupEventListeners() {
	// Select whole code output on focus
	elemOutputOld.addEventListener("focus", () => {
		elemOutputOld.select();
	});

	elemOutputNew.addEventListener("focus", () => {
		elemOutputNew.select();
	});


	// Detect clicks on Copy
	elemCopyOld.addEventListener("click", () => {
		clipboard.copy(elemOutputOld.value);
		clipboard.displayCopied(elemCopyOld);
	});

	elemCopyNew.addEventListener("click", () => {
		clipboard.copy(elemOutputNew.value);
		clipboard.displayCopied(elemCopyNew);
	});
}
