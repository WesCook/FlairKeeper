import {trophies, variants as trophyVariants} from '../config.js';
import {colorFromString} from './modules/color-from-string.js';

const debug = typeof new URLSearchParams(window.location.search).get("debug") === 'string';
if (debug) {
	document.documentElement.classList.add("debug");
}

const variants = generateVariants();
let permutations = [];

(async function main() {
	permutations = await generatePermutations();
	listPermutations(permutations);
	generateCSS(permutations);
	await createImages();
	let elemCanvas = drawCanvas(permutations);
	generatePreview(elemCanvas);
})();

// Flat list of trophies with variants for easier looping
function generateVariants() {
	let variants = [];
	trophies.forEach(trophy => {
		trophyVariants.forEach(variant => {
			if (!trophy.variants[variant]) {
				return;
			}

			let entry = {};
			entry.id = trophy.id;
			entry.name = trophy.name;
			entry.variantName = variant;
			entry.css_text = trophy.variants[variant].css_text;
			entry.css_class = trophy.variants[variant].css_class;
			entry.icon = trophy.variants[variant].icon;
			variants.push(entry);
		});
	});
	return variants;
}

async function generatePermutations() {
	let promise = new Promise((resolve, reject) => {
		// Object with Variant names, each containing array of class names
		let classListByVariant = {};
		variants.forEach(variant => {
			if (typeof classListByVariant[variant.variantName] === 'undefined') {
				classListByVariant[variant.variantName] = new Array();
			}
			classListByVariant[variant.variantName].push(variant.css_class);
		});

		/*
		This code is rather complex.  It recursively calculates all permutations for each flair variant.

		The set of ordered subsequences is known as a powerset.  It's better explained here:
		https://www.geeksforgeeks.org/generating-all-possible-subsequences-using-recursion/

		This version is modified to also include variants for each element, which act as exclusive pairs.  eg. Main, SL1.
		It grows exponentially: ((x + 1) ^ y) - 1, where x is the number of variants and y is the number of entries.
		*/
		let permutations = [];
		function addSubsequences(index, subPermArray) {
			if (index === trophies.length) {
				if (subPermArray.length !== 0) {
					permutations.push(subPermArray);
				}
			} else {
				addSubsequences(index + 1, subPermArray);
				trophyVariants.forEach(variant => {
					if (classListByVariant[variant][index]) {
						addSubsequences(index + 1, subPermArray.concat(classListByVariant[variant][index]))
					}
				});
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

function generateCSS(permutations) {
	let elemCSS = document.getElementById("output-css");
	let content = "";
	let y = 0;
	permutations.forEach(permutation => {
		content += `.flair-${ permutation.join('') }T {background-position: 0 -${ y * 16 }px; width: ${ permutation.length * 16 }px;}\n`;
		y++;
	});

	elemCSS.textContent = content;
}

// Images need to be created on-page and loaded to paint them on the canvas
// This function ensures they are fully loaded before we move on
async function createImages() {
	let promise = new Promise((resolve, reject) => {
		let trophyList = document.getElementById("spritesheet-trophy-list");

		// Determine total number of variants
		let loadedCount = 0;
		let totalCount = 0;

		// Create elements
		variants.forEach(variant => {
			let img = document.createElement("img");
			img.id = variant.id + "-" + variant.variantName;
			img.src = variant.icon;
			img.width = "16";
			img.height = "16";
	
			img.addEventListener("load", () => {
				loadedCount++;
				if (loadedCount === totalCount) {
					resolve(); // All trophy images loaded
				}
			});

			totalCount++;
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
	variants.forEach(variant => {
		trophyElements[variant.css_class] = document.getElementById(variant.id + "-" + variant.variantName);
	});

	let y = 0;
	permutations.forEach(permutation => {
		let x = 0;
		permutation.forEach(single => {
			variants.forEach(variant => {
				if (single === variant.css_class) {
					// Draw background square based on variant name for debugging purposes
					if (debug) {
						ctx.fillStyle = colorFromString(variant.variantName);
						ctx.fillRect(x*16, y*16, 16, 16);
					}

					// Draw icon
					let img = trophyElements[single];
					ctx.drawImage(img, x*16, y*16);
					x++;
				}
			});
		});
		y++;
	});

	return elemCanvas;
}

function generatePreview(elemCanvas) {
	elemCanvas.toBlob(blob => {
		try {
			let url = URL.createObjectURL(blob);

			let elemImg = document.createElement('img');
			elemImg.src = url;
			elemImg.classList.add("spritesheet-img");
			document.getElementById("section-spritesheet").appendChild(elemImg);

			let elemDownloadLink = document.getElementById("spritesheet-download");
			elemDownloadLink.setAttribute("download", "spritesheet.png");
			elemDownloadLink.setAttribute("href", url);
		} catch(err) {
			console.log("There was an error rendering the canvas: " + err);
		}
	}, "image/png", 1);
}
