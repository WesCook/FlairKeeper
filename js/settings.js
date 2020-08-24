import * as auth from './modules/auth.js';

const elemImportList = document.getElementById("subreddit-import-list");
const elemExportList = document.getElementById("subreddit-export-list");
const elemSave = document.getElementById("btn-save");

(async function main() {
	await checkNewAuthorization(); // Requires an IIFE until top-level await is approved (https://github.com/tc39/proposal-top-level-await)
	await populateFields();
})();

wireButtons();

// Check if "code" query string exists to set up an OAuth connection
async function checkNewAuthorization() {
	// No code, so not trying to connect
	let code = new URLSearchParams(window.location.search).get("code");
	if (!code) {
		return;
	}

	let stateReceived = new URLSearchParams(window.location.search).get("state");
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
async function populateFields() {
	if (!localStorage.getItem("refreshToken")) {
		console.log("Cannot populate fields.  Refresh token not found");
		return;
	}

	let reddit = await auth.getReddit();
	let subList = await reddit.getModeratedSubreddits();

	// Re-enable elements
	document.getElementById("settings-spinner").classList.add("hidden");
	elemImportList.disabled = false;
	elemImportList.innerHTML = "";
	elemSave.disabled = false;

	// Load saved data
	let importSub = localStorage.getItem("importSub") || "";
	let exportSubs = localStorage.getItem("exportSubs") || [];

	// Generate fields and populate with saved data
	subList.forEach(sub => {
		let hasFlairPermission = (sub.mod_permissions.includes("all") || sub.mod_permissions.includes("flair"));

		////////////////
		// Import Sub //
		////////////////

		// Create dropdown
		let elemOption = document.createElement("OPTION");
		elemOption.textContent = "/" + sub.display_name_prefixed;

		if (elemOption.textContent === importSub) {
			elemOption.selected = true;
		}
		elemImportList.appendChild(elemOption);

		/////////////////
		// Export Subs //
		/////////////////

		let elemListItem = document.createElement("li");

		// Create checkbox
		let elemInput = document.createElement("input");
		elemInput.type = "checkbox";
		elemInput.id = "sub-" + sub.display_name;
		elemInput.classList.add("subreddit-export-item");
		elemInput.name = "/" + sub.display_name_prefixed;

		if (exportSubs.includes(elemInput.name)) {
			elemInput.checked = true;
		}

		if (!hasFlairPermission) {
			elemInput.disabled = true;
			elemInput.checked = false;
		}

		// Create label
		elemListItem.appendChild(elemInput);

		let elemLabel = document.createElement("label");
		elemLabel.htmlFor = "sub-" + sub.display_name;
		elemLabel.textContent = "/" + sub.display_name_prefixed;

		if (!hasFlairPermission) {
			elemLabel.title = "Missing flair permission";
			elemLabel.classList.add("faded");
		}

		elemListItem.appendChild(elemLabel);

		elemExportList.appendChild(elemListItem);
	});
}

function wireButtons() {
	// Save button
	document.getElementById("btn-save").addEventListener("click", buttonSave);

	// Connect button
	if (!localStorage.getItem("refreshToken")) {
		let btnConnect = document.getElementById("btn-connect");
		btnConnect.disabled = false;
		btnConnect.addEventListener("click", auth.buttonConnect);
	} else {
		// Disconnect button
		let btnDisconnect = document.getElementById("btn-disconnect");
		btnDisconnect.disabled = false;
		btnDisconnect.addEventListener("click", buttonDisconnect);
	}
	
}

// Delete local data and revoke app
async function buttonDisconnect() {
	if (!confirm("Are you sure you'd like to disconnect your account?")) {
		return;
	}

	let reddit = await auth.getReddit();
	await reddit.revokeRefreshToken();

	localStorage.removeItem("refreshToken");
	localStorage.removeItem("importSub");
	localStorage.removeItem("exportSubs");
	window.location.href = "./";
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

	elemSave.textContent = "Saved!";
	setTimeout(() => {
		elemSave.textContent = "Save";
	},
	1500);
}
