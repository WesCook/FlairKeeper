import {redditApp} from '../../config.js';

function request() {
	return snoowrap.fromAuthCode({
		code: new URL(window.location.href).searchParams.get('code'),
		userAgent: redditApp.userAgent,
		clientId: redditApp.clientId,
		redirectUri: getRedirectURI()
	});
}

function getRedirectURI() {
	let loc = window.location;
	let url = loc.origin + loc.pathname.substring(0, loc.pathname.lastIndexOf('/')) + "/settings.html";
	return url;
}

function generateRandomState() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getAuthorizeURI() {
	return `https://www.reddit.com/api/v1/authorize?client_id=${redditApp.clientId}&response_type=code&state=${generateRandomState()}&redirect_uri=${getRedirectURI()}&duration=permanent&scope=modflair%20mysubreddits`;
}

export {request, getRedirectURI, getAuthorizeURI};
