// The login credentials for the reddit account.  Must be a moderator with flair permission.
const redditAccount = {
	username: "usernamehere",
	password: "passwordhere"
}

// The subreddit to import trophy data from
const importSubreddit = "darksouls3";

// The subreddits to export trophy data to
const exportSubreddits = [
	"demonssouls",
	"darksouls",
	"DarkSouls2",
	"bloodborne",
	"darksouls3",
	"eldenringdiscussion"
]

// List of game names, an icon to represent it, and the flair code it will produce
const trophies = [
	{id: "demonssouls", name: "Demon's Souls", icon: "./img/trophies/platinum.png", code: "De"},
	{id: "darksouls1", name: "Dark Souls", icon: "./img/trophies/bronze.png", code: "Da"},
	{id: "darksouls2", name: "Dark Souls II", icon: "./img/trophies/gold.png", code: "Da2"},
	{id: "bloodborne", name: "Bloodborne", icon: "./img/trophies/green.png", code: "Bb"},
	{id: "darksouls3", name: "Dark Souls III", icon: "./img/trophies/purple.png", code: "Da3"},
	{id: "sekiro", name: "Sekiro", icon: "./img/trophies/magenta.png", code: "Sek"}
	// {id: "eldenring", name: "Elden Ring", icon: "./img/trophies/charcoal.png", code: "Eld"}
	// {id: "zzt", name: "ZZT", icon: "./img/trophies/ash.png", code: "ZZT"}
]

export {redditAccount, importSubreddit, exportSubreddits, trophies};
