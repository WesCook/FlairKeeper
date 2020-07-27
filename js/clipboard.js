export function copy(text) {
	navigator.clipboard.writeText(text)
	.catch(err => {
		console.error('Could not copy text: ', err);
	});
}
