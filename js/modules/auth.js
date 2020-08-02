import {redditApp} from '../../config.js';

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

// Initial OAuth connection URI
function getAuthorizeURI() {
	return snoowrap.getAuthUrl({
		clientId: redditApp.clientId,
		scope: ["modflair", "mysubreddits"],
		redirectUri: getRedirectURI(),
		permanent: true,
		state: localStorage.getItem("state")
	});
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

async function getReddit() {
	// TODO: Cache this result
	return await new snoowrap({
		refreshToken: getRefreshToken(),
		userAgent: redditApp.userAgent,
		clientId: redditApp.clientId,
		clientSecret: ""
	});
}

function getRefreshToken() {
	return localStorage.getItem("refreshToken");
}

export {getReddit, getAuthorizeURI, exchangeAuthCodeForRefreshToken, getRefreshToken, buttonConnect};
