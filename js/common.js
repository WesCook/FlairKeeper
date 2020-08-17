import * as auth from './modules/auth.js';

if (!localStorage.getItem("refreshToken")) {
	wireConnect();
}

function wireConnect() {
	let btnConnect = document.getElementById("btn-connect");
	btnConnect.disabled = false;
	btnConnect.addEventListener("click", auth.buttonConnect);
}
