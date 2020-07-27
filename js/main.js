import {redditAccount, importSubreddit, exportSubreddits, trophies} from '../config.js';
import {copy} from './clipboard.js';
import {generateCodes} from './generateCodes.js';

let elemTrophyList = document.getElementById("trophy-list");
let elemOutputOld = document.getElementById("output-old");
let elemOutputNew = document.getElementById("output-new");
let elemCopyOld = document.getElementById("output-old-copy");
let elemCopyNew = document.getElementById("output-new-copy");

createTrophyList();


// Select whole code output on focus
elemOutputOld.addEventListener("focus", () => {
	elemOutputOld.select();
});
elemOutputNew.addEventListener("focus", () => {
	elemOutputNew.select();
});


// Detect clicks on Copy
elemCopyOld.addEventListener("click", () => {
	copy(elemOutputOld.value);
	elemCopyOld.textContent = "Copied!";
});
elemCopyNew.addEventListener("click", () => {
	copy(elemOutputNew.value);
	elemCopyNew.textContent = "Copied!";
});


function createTrophyList() {
	elemTrophyList.innerHTML = "";
	trophies.forEach(trophy => {
		let figure = document.createElement("figure");
		let img = document.createElement("img");
		let figcaption = document.createElement("figcaption");

		figure.classList = "trophy";
		figure.id = trophy.id;
		figure.dataset.unlocked = 0;
		img.src = trophy.icon;
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
	updateCodes();
}


function updateCodes() {
	let codes = generateCodes();
	elemOutputOld.value = codes.old;
	elemOutputNew.value = codes.new;
}
