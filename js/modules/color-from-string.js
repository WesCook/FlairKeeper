// Based on https://stackoverflow.com/a/49562686/582883
export function colorFromString(str) {
	let hash = 0;
	for (let i=0; i<str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return `hsl(${ hash % 300 }, 100%, 40%)`;
}
