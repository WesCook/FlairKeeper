import * as auth from './modules/auth.js';

const refreshToken = auth.getRefreshToken();
if (refreshToken) {
	document.body.classList.add("connected");
	// TODO: Verify auth token is valid for user
} else {
	wireConnect();
}

function wireConnect() {
	let btnConnect = document.getElementById("btn-connect");
	btnConnect.disabled = false;
	btnConnect.addEventListener("click", auth.buttonConnect);
}
