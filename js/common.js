import * as auth from './modules/auth.js';

const refreshToken = auth.getRefreshToken();

if (refreshToken) {
	document.body.classList.add("connected");

	let reddit = auth.getReddit().then(r => {
		r.getModeratedSubreddits().then(console.log);
	});
} else {
	wireConnect();
}

function wireConnect() {
	let btnConnect = document.getElementById("btn-connect");
	btnConnect.disabled = false;
	btnConnect.addEventListener("click", auth.buttonConnect);
}
