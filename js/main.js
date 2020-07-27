import {redditAccount, importSubreddit, exportSubreddits, trophies} from '../config.js';

// Load and embed trophies
let trophyList = document.getElementById("trophy-list");
trophies.forEach(trophy => {
    let elem = document.createElement("img");
    elem.src = trophy.icon;
    elem.title = elem.alt = trophy.name;
    trophyList.appendChild(elem);
});
