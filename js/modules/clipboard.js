// Copies text to the clipboard
export function copy(text) {
	navigator.clipboard.writeText(text)
	.catch(err => {
		console.error('Could not copy text: ', err);
	});
}


// Sets an element's text to "Copied!", then reverts it after 1.5 seconds
export function displayCopied(elem) {
	let oldText = elem.textContent;
	elem.textContent = "Copied!";
	window.setTimeout(() => {
		elem.textContent = oldText;
	},
	1500);
}
