import {redditApp} from '../../config.js';

let reddit = null;

async function getReddit() {
	let token = localStorage.getItem("refreshToken");
	if (!token) {
		return Promise.reject("Cannot return reddit promise.  Refresh token not found");
	}

	// Only fetches reddit promise once (per-page load)
	if (reddit === null) {
		reddit = await new snoowrap({
			refreshToken: token,
			userAgent: redditApp.userAgent,
			clientId: redditApp.clientId,
			clientSecret: ""
		});
	}
	return reddit;
}

async function exchangeAuthCodeForRefreshToken(code) {
	let redditPromise = await snoowrap.fromAuthCode({
		code: code,
		userAgent: redditApp.userAgent,
		clientId: redditApp.clientId,
		redirectUri: getRedirectURI()
	})
	return redditPromise.refreshToken;
}

function buttonConnect() {
	let state = generateRandomState();
	localStorage.setItem("state", state);
	window.location.href = getAuthorizeURI();
}

// Initial OAuth connection URI
function getAuthorizeURI() {
	return snoowrap.getAuthUrl({
		clientId: redditApp.clientId,
		scope: ["read", "mysubreddits", "flair", "modflair"],
		redirectUri: getRedirectURI(),
		permanent: true,
		state: localStorage.getItem("state")
	});
}

// State is returned after app is authorized
// Check to ensure request is valid
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate clean link to /settings.html
function getRedirectURI() {
	let loc = window.location;
	let url = loc.origin + loc.pathname.substring(0, loc.pathname.lastIndexOf('/')) + "/settings.html";
	return url;
}

export {getReddit, exchangeAuthCodeForRefreshToken, buttonConnect};
