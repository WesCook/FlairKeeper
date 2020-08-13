import {trophies} from '../config.js';

generatePermutations().then(permutations => {
	listPermutations(permutations);
	createImages().then(() => {
		let elemCanvas = drawCanvas(permutations);
		//let url = elemCanvas.toDataURL("image/png");
		//console.log(url);
	});
});

async function createImages() {
	let promise = new Promise((resolve, reject) => {
		let trophyList = document.getElementById("spritesheet-trophy-list");
		let loadedCount = 0;

		trophies.forEach(trophy => {
			let img = document.createElement("img");
			img.id = trophy.id;
			img.src = trophy.icon;
			img.width = "16";
			img.height = "16";
	
			img.addEventListener("load", () => {
				loadedCount++;
				if (loadedCount === trophies.length) {
					resolve(); // All trophy images loaded
				}
			});
	
			trophyList.appendChild(img);
		});
	});

	return promise;
}

function drawCanvas(permutations) {
	let elemCanvas = document.getElementById("spritesheet");
	let ctx = elemCanvas.getContext("2d");

	elemCanvas.width = trophies.length * 16;
	elemCanvas.height = permutations.length * 16;

	let trophyElements = {};
	trophies.forEach(trophy => {
		trophyElements["code-" + trophy.oldCode] = document.getElementById(trophy.id);
	});

	let y = 0;
	permutations.forEach(permutation => {
		let x = 0;
		permutation.forEach(single => {
			trophies.forEach(trophy => {
				if (single === trophy.oldCode || single === trophy.oldCode + "+") {
					// Removes trailing +
					// TODO: Remove once SL1 flair icons are added
					if (single.slice(-1) === '+') {
						single = single.slice(0, -1);
					}

					let img = trophyElements["code-" + single];
					ctx.drawImage(img, x*16, y*16);
					x++;
				}
			});
		});
		y++;
	});

	return elemCanvas;
}

async function generatePermutations() {
	let promise = new Promise((resolve, reject) => {
		const mainList = trophies.map(trophy => trophy.oldCode);
		const altList = trophies.map(trophy => trophy.oldCode + "+");
		let permutations = [];

		function addSubsequences(index, subarr) {
			if (index === mainList.length) {
				if (subarr.length !== 0) {
					permutations.push(subarr);
				}
			} else {
				addSubsequences(index + 1, subarr); // Subsequence without including the element at current index
				addSubsequences(index + 1, subarr.concat(mainList[index])); // Subsequence including the main element at current index
				addSubsequences(index + 1, subarr.concat(altList[index])); // Subsequence including the alternate element at current index
			}
			return;
		}
		addSubsequences(0, []);

		resolve(permutations);
	});

	return promise;
}

function listPermutations(permutations) {
	let elemPermutations = document.getElementById("output-permutations");
	let content = "";

	permutations.forEach(permutation => {
		permutation.forEach(single => content += single);
		content += '\n';
	});

	elemPermutations.textContent = content;
}
