import * as auth from './modules/auth.js';
import {redditApp} from '../config.js';

// Check cookie for connected OAuth account, set UI accordingly
// TODO: All of this, obviously
if (false) {
	document.body.classList.add("connected");
}


const reddit = auth.request().then(r => {
	r.getModeratedSubreddits().then(console.log);
})


let elemConnect = document.getElementById("btn-connect");
elemConnect.href = auth.getAuthorizeURI();
