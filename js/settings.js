import './common.js';
import * as auth from './modules/auth.js';

checkNewAuthorization().finally(
	populateFields
);

wireDisconnect();

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
}

function wireDisconnect() {
	let btnDisconnect = document.getElementById("btn-disconnect");
	btnDisconnect.disabled = false;
	btnDisconnect.addEventListener("click", buttonDisconnect);
}

// Fetch subreddit data and populate dropdowns/checkboxes
function populateFields() {
	if (!auth.getRefreshToken()) {
		console.log("Cannot populate fields.  Refresh token not found");
		return;
	}

	let elemImportList = document.getElementById("subreddit-import-list");
	let elemExportList = document.getElementById("subreddit-export-list");
	let elemSave = document.getElementById("btn-save");

	auth.getReddit()
		.then(r => r.getModeratedSubreddits())
		.then(subList => {
			// Re-enable elements
			elemImportList.disabled = false;
			elemImportList.innerHTML = "";
			elemSave.disabled = false;

			// Generate contents
			subList.forEach(sub => {
				// Import List
				let elemOption = document.createElement("OPTION");
				elemOption.textContent = "/" + sub.display_name_prefixed;
				elemImportList.appendChild(elemOption);

				// Export List
				let elemListItem = document.createElement("LI");

				let elemInput = document.createElement("INPUT");
				elemInput.type = "checkbox";
				elemInput.id = "sub_" + sub.display_name;
				elemInput.name = sub.display_name;
				elemListItem.appendChild(elemInput);

				let elemLabel = document.createElement("LABEL");
				elemLabel.htmlFor = "sub_" + sub.display_name;
				elemLabel.textContent = "/" + sub.display_name_prefixed;
				elemListItem.appendChild(elemLabel);

				elemExportList.appendChild(elemListItem);
			})
		});
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
