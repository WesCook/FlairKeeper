import {redditAccount, importSubreddit, exportSubreddits, trophies} from '../config.js';

// Load and embed trophies
let elemTrophyList = document.getElementById("trophy-list");
trophies.forEach(trophy => {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    figure.classList = "trophy";
    figure.id = trophy.id;
    figure.dataset.unlocked = 0;
    img.src = trophy.icon;
    img.alt = trophy.name;
    figcaption.textContent = trophy.name;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    figure.addEventListener("click", toggleTrophy);
    elemTrophyList.appendChild(figure);
});


function toggleTrophy() {
    this.dataset.unlocked ^= true;
    generateFlairCodes();
}


function generateFlairCodes() {
    let flairCodeOld = "";
    let flairCodeNew = "";
    trophies.forEach(trophy => {
        if (document.getElementById(trophy.id).dataset.unlocked === "1") {
            flairCodeOld += trophy.oldCode;
            flairCodeNew += ":" + trophy.newCode + ":";
        }
    });
    document.getElementById("output-old").value = flairCodeOld;
    document.getElementById("output-new").value = flairCodeNew;
}
