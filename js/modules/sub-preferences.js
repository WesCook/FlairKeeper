function getImport() {
	const importSub = localStorage.getItem("importSub");
	if (importSub) {
		return convertPrefix(importSub, true);
	}
	return null;
}

function getExport() {
	let exportSubs;
	const str = localStorage.getItem("exportSubs");
	if (str) {
		exportSubs = JSON.parse(str);
		exportSubs = exportSubs.map(sub => convertPrefix(sub, true));
	}
	return exportSubs;
}

// Converts /u/example to /r/u__example
// Strip parameter removes the /r/ prefix
function convertPrefix(sub, strip) {
	if (sub.startsWith("/u/")) {
		sub = sub.replace("/u/", "/r/u_");
	}
	if (strip) {
		sub = sub.replace("/r/", "");
	}
	return sub;
}

export {getImport, getExport, convertPrefix};
