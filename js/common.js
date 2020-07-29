//import {getAuth} from './modules/snoowrap.js';
import {redditApp} from '../config.js';

//const reddit = getAuth();

// Check cookie for connected OAuth account, set UI accordingly
// TODO: All of this, obviously
if (true) {
	document.body.classList.add("connected");
}


const reddit = snoowrap.fromAuthCode({
	code: new URL(window.location.href).searchParams.get('code'),
	userAgent: redditApp.userAgent,
	clientId: redditApp.clientId,
	redirectUri: window.location.origin + window.location.pathname + "settings.html"
});
