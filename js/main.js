import {redditAccount, importSubreddit, exportSubreddits, trophies} from '../config.js';

let elemOutputOld = document.getElementById("output-old");
let elemOutputNew = document.getElementById("output-new");
let elemCopyOld = document.getElementById("output-old-copy");
let elemCopyNew = document.getElementById("output-new-copy");

// Load and embed trophies
let elemTrophyList = document.getElementById("trophy-list");
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


function toggleTrophy() {
	this.dataset.unlocked ^= true;
	generateFlairCodes();
}


function generateFlairCodes() {
	let flairCodeOld = "";
	let flairCodeNew = "";
	trophies.forEach(trophy => {
		if (document.getElementById(trophy.id).dataset.unlocked === "1") {
			flairCodeOld += trophy.oldCode;
			flairCodeNew += ":" + trophy.newCode + ":";
		}
	});
	elemOutputOld.value = flairCodeOld;
	elemOutputNew.value = flairCodeNew;
}


elemOutputOld.addEventListener("focus", () => {
	elemOutputOld.select();
});
elemOutputNew.addEventListener("focus", () => {
	elemOutputNew.select();
});


elemCopyOld.addEventListener("click", () => {
	copy(elemOutputOld.value);
	elemCopyOld.textContent = "Copied!";
});
elemCopyNew.addEventListener("click", () => {
	copy(elemOutputNew.value);
	elemCopyNew.textContent = "Copied!";
});


function copy(text) {
	navigator.clipboard.writeText(text)
	.catch(err => {
		console.error('Could not copy text: ', err);
	});
}
