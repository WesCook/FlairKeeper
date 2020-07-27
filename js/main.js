import {redditAccount, importSubreddit, exportSubreddits, trophies} from '../config.js';

// Load and embed trophies
let trophyList = document.getElementById("trophy-list");
trophies.forEach(trophy => {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    img.src = trophy.icon;
    img.alt = trophy.name;
    figcaption.textContent = trophy.name;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    trophyList.appendChild(figure);
});
