import './common.js';
import * as auth from './modules/auth.js';

checkNewAuthorization();
wireDisconnect();


const refreshToken = auth.getRefreshToken();
if (refreshToken) {
	let elemImportList = document.getElementById("subreddit-import-list");
	let elemExportList = document.getElementById("subreddit-export-list");

	let reddit = auth.getReddit()
		.then(r => r.getModeratedSubreddits())
		.then(subList => {
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


async function checkNewAuthorization() {
	let code = new URL(window.location.href).searchParams.get("code");
	let stateReceived = new URL(window.location.href).searchParams.get("state");
	let stateSent = localStorage.getItem("state");

	// No code, so not trying to connect
	if (!code) {
		return;
	}

	if (stateReceived !== stateSent) {
		console.log("State does not match");
		return;
	}

	let refreshToken = await auth.exchangeAuthCodeForRefreshToken(code);
	localStorage.setItem("refreshToken", refreshToken);
	localStorage.removeItem("state");
	document.body.classList.add("connected");
	// TODO: Update UI to pull in subreddits
}

function wireDisconnect() {
	let btnDisconnect = document.getElementById("btn-disconnect");
	btnDisconnect.disabled = false;
	btnDisconnect.addEventListener("click", buttonDisconnect);
}

// Delete local data and revoke app
function buttonDisconnect() {
	auth.getReddit()
	.then(r => r.revokeRefreshToken())
	.then(() => {
		localStorage.removeItem("refreshToken");
		window.location.href = "./"
	});
}
