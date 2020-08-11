import './common.js';
import * as auth from './modules/auth.js';

let elemImportList = document.getElementById("subreddit-import-list");
let elemExportList = document.getElementById("subreddit-export-list");

(async function main() {
	await checkNewAuthorization(); // Requires an IIFE until top-level await is approved (https://github.com/tc39/proposal-top-level-await)
	populateFields();
})();

wireButtons();

// Check if "code" query string exists to set up an OAuth connection
async function checkNewAuthorization() {
	let code = new URL(window.location.href).searchParams.get("code");

	// No code, so not trying to connect
	if (!code) {
		return;
	}

	let stateReceived = new URL(window.location.href).searchParams.get("state");
	let stateSent = localStorage.getItem("state");

	if (stateReceived !== stateSent) {
		console.log("State does not match");
		return;
	}

	document.documentElement.classList.add("connected");
	let refreshToken = await auth.exchangeAuthCodeForRefreshToken(code);
	localStorage.setItem("refreshToken", refreshToken);
	localStorage.removeItem("state");
	history.replaceState(null, '', 'settings.html'); // Clean variables from URL
}

// Fetch subreddit data and populate dropdowns/checkboxes
function populateFields() {
	if (!auth.getRefreshToken()) {
		console.log("Cannot populate fields.  Refresh token not found");
		return;
	}

	auth.getReddit()
		.then(r => r.getModeratedSubreddits())
		.then(subList => {
			// Re-enable elements
			let elemSave = document.getElementById("btn-save");
			elemImportList.disabled = false;
			elemImportList.innerHTML = "";
			elemSave.disabled = false;

			// Load saved data
			let importSub = localStorage.getItem("importSub") || "";
			let exportSubs = localStorage.getItem("exportSubs") || [];

			// Generate contents
			subList.forEach(sub => {
				// Import List
				let elemOption = document.createElement("OPTION");
				elemOption.textContent = "/" + sub.display_name_prefixed;

				if (elemOption.textContent === importSub) {
					elemOption.selected = true;
				}
				elemImportList.appendChild(elemOption);

				// Export List
				let elemListItem = document.createElement("LI");

				let elemInput = document.createElement("INPUT");
				elemInput.type = "checkbox";
				elemInput.id = "sub-" + sub.display_name;
				elemInput.classList.add("subreddit-export-item");
				elemInput.name = "/" + sub.display_name_prefixed;

				if (exportSubs.includes(elemInput.name)) {
					elemInput.checked = true;
				}

				elemListItem.appendChild(elemInput);

				let elemLabel = document.createElement("LABEL");
				elemLabel.htmlFor = "sub-" + sub.display_name;
				elemLabel.textContent = "/" + sub.display_name_prefixed;
				elemListItem.appendChild(elemLabel);

				elemExportList.appendChild(elemListItem);
			})
		});
}

function wireButtons() {
	let btnDisconnect = document.getElementById("btn-disconnect");
	btnDisconnect.disabled = false;
	btnDisconnect.addEventListener("click", buttonDisconnect);

	document.getElementById("btn-save").addEventListener("click", buttonSave);
}

// Delete local data and revoke app
function buttonDisconnect() {
	if (!confirm("Are you sure you'd like to disconnect your account?")) {
		return;
	}

	auth.getReddit()
	.then(r => r.revokeRefreshToken())
	.finally(() => {
		localStorage.removeItem("refreshToken");
		window.location.href = "./"
	});
}

function buttonSave() {
	let exportNodeList = document.querySelectorAll(".subreddit-export-item")
	localStorage.setItem("importSub", elemImportList.value);

	let exportList = [];
	exportNodeList.forEach(item => {
		if (item.checked) {
			exportList.push(item.name);
		}
	});

	localStorage.setItem("exportSubs", JSON.stringify(exportList));
}
