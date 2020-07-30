//import {getAuth} from './modules/snoowrap.js';
import {redditApp} from '../config.js';

//const reddit = getAuth();

// Check cookie for connected OAuth account, set UI accordingly
// TODO: All of this, obviously
if (true) {
	document.body.classList.add("connected");
}

let loc = window.location;
let url = loc.origin + loc.pathname.substring(0, loc.pathname.lastIndexOf('/')) + "/settings.html";

const reddit = snoowrap.fromAuthCode({
	code: new URL(loc.href).searchParams.get('code'),
	userAgent: redditApp.userAgent,
	clientId: redditApp.clientId,
	redirectUri: url
});
