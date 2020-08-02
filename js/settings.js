import './common.js';
import * as auth from './modules/auth.js';

checkNewAuthorization();
wireDisconnect();

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
