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

const trophies = [
	{name: "Demon's Souls", icon: "./img/trophies/platinum.png"},
	{name: "Dark Souls", icon: "./img/trophies/bronze.png"},
	{name: "Dark Souls 2", icon: "./img/trophies/gold.png"},
	{name: "Bloodborne", icon: "./img/trophies/green.png"},
	{name: "Dark Souls 3", icon: "./img/trophies/purple.png"},
	{name: "Sekiro", icon: "./img/trophies/magenta.png"}
	// {name: "Elden Ring", icon: "./img/trophies/charcoal.png"}
	// {name: "ZZT", icon: "./img/trophies/ash.png"}
]

export {redditAccount, importSubreddit, exportSubreddits, trophies};
