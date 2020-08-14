import {trophies, variants} from '../config.js';

generatePermutations().then(permutations => {
	listPermutations(permutations);
	generateCSS(permutations);
	createImages().then(() => {
		let elemCanvas = drawCanvas(permutations);
		generatePreview(elemCanvas);
	});
});

async function generatePermutations() {
	let promise = new Promise((resolve, reject) => {
		let classListByVariant = {};
		trophies.forEach(trophy => {
			variants.forEach(variant => {
				if (!trophy.variants[variant]) {
					return;
				}
				if (typeof classListByVariant[variant] === 'undefined') {
					classListByVariant[variant] = new Array();
				}
				classListByVariant[variant].push(trophy.variants[variant].css_text);
			});
		});

		/*
		This code is rather complex.  It recursively calculates all permutations for each flair variant.

		The set of ordered subsequences is known as a powerset.  It's better explained here:
		https://www.geeksforgeeks.org/generating-all-possible-subsequences-using-recursion/

		This version is modified to also include variants for each element, which act as exclusive pairs.
		eg. Main, SL1.
		It grows exponentially (x^y-1), where x is the number of variants+1 and y is the number of entries.
		*/
		let permutations = [];
		function addSubsequences(index, subarr) {
			if (index === trophies.length) {
				if (subarr.length !== 0) {
					permutations.push(subarr);
				}
			} else {
				addSubsequences(index + 1, subarr);
				variants.forEach(variant => {
					if (classListByVariant[variant][index]) {
						addSubsequences(index + 1, subarr.concat(classListByVariant[variant][index]))
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

	let content = `.flair[class$="T"]:after {
	display: inline-block;
	content: "";
	height: 16px;
	vertical-align: -5px;
	margin: 0 3px;
}
.link .flair[class$="T"]:after {
	margin-top: -4px !important;
}\n\n`;

	let y = 0;
	permutations.forEach(permutation => {
		content += `.flair-${ permutation.join('') }T:after {background: url(%%s%%) 0 -${ y * 16 }px; width: ${ permutation.length * 16 }px;}\n`;
		y++; // TODO: Remove hardcoded 16x16 size
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
		trophies.forEach(trophy => {
			variants.forEach(variant => {
				if (!trophy.variants[variant]) {
					return;
				}

				let img = document.createElement("img");
				img.id = trophy.id + "-" + variant;
				img.src = trophy.variants[variant].icon;
				img.width = "16";
				img.height = "16";
				// TODO: Remove hardcoding of image size
		
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
		variants.forEach(variant => {
			if (!trophy.variants[variant]) {
				return;
			}

			trophyElements[trophy.variants[variant].css_text] = document.getElementById(trophy.id + "-" + variant);
		});
	});

	let y = 0;
	permutations.forEach(permutation => {
		let x = 0;
		permutation.forEach(single => {
			trophies.forEach(trophy => {
				variants.forEach(variant => {
					if (trophy.variants[variant] && trophy.variants[variant].css_text === single) {
						let img = trophyElements[single];
						ctx.drawImage(img, x*16, y*16);
						x++;
					}
				});
			});
		});
		y++;
	});

	return elemCanvas;
}

function generatePreview(elemCanvas) {
	elemCanvas.toBlob(blob => {
		let url = URL.createObjectURL(blob);

		let elemImg = document.createElement('img');
		elemImg.src = url;
		elemImg.classList.add("spritesheet-img");
		document.getElementById("section-spritesheet").appendChild(elemImg);

		let elemDownloadLink = document.getElementById("spritesheet-download");
		elemDownloadLink.setAttribute("download", "s.png");
		elemDownloadLink.setAttribute("href", url);
	}, "image/png", 1);
}
