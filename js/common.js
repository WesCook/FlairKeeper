import * as auth from './modules/auth.js';

if (!auth.getRefreshToken()) {
	wireConnect();
}

function wireConnect() {
	let btnConnect = document.getElementById("btn-connect");
	btnConnect.disabled = false;
	btnConnect.addEventListener("click", auth.buttonConnect);
}
