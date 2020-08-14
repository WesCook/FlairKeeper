// Reddit Application information (https://www.reddit.com/prefs/apps/)
const redditApp = {
	clientId: "ftsPs2iwqWeb2A",
	userAgent: "SoulsFlairBot"
}

// Variants for each flair option
// Use simple names.  "Main" is required.
const variants = ["Main", "SL1"];

// Trophy list
// ID: the ID for the element
// Name: the label under the icon
// Icon: path to an image to display
// css_text: The same, but for new reddit's emojis.  Automatically adds surrounding colons (eg. ":DeS::Bb::Sek:").
// css_class: The flair code to represent this game on the subreddit.  Always ends in a 'T'.  Applies to old Reddit (eg. "DeBbSekT").
const trophies = [
	{
		id: "demonssouls", name: "Demon's Souls", variants: {
			"Main": {css_text: "De", css_class: "DeS", icon: "img/trophies/platinum.png"},
			"SL1": {css_text: "De+", css_class: "DeS+", icon: "img/trophies/platinum+.png"}
		}
	},
	{
		id: "darksouls1", name: "Dark Souls", variants: {
			"Main": {css_text: "Da", css_class: "DaS", icon: "img/trophies/bronze.png"},
			"SL1": {css_text: "Da+", css_class: "DaS+", icon: "img/trophies/bronze+.png"}
		}
	},
	{
		id: "darksouls2", name: "Dark Souls II", variants: {
			"Main": {css_text: "Da2", css_class: "DaS2", icon: "img/trophies/gold.png"},
			"SL1": {css_text: "Da2+", css_class: "DaS2+", icon: "img/trophies/gold+.png"}
		}
	},
	{
		id: "bloodborne", name: "Bloodborne", variants: {
			"Main": {css_text: "Bb", css_class: "Bb", icon: "img/trophies/green.png"},
			"SL1": {css_text: "Bb+", css_class: "Bb+", icon: "img/trophies/green+.png"}
		}
	},
	{
		id: "darksouls3", name: "Dark Souls III", variants: {
			"Main": {css_text: "Da3", css_class: "DaS3", icon: "img/trophies/purple.png"},
			"SL1": {css_text: "Da3+", css_class: "DaS3+", icon: "img/trophies/purple+.png"}
		}
	},
	// Having gaps in variants is not a good idea, and may cause bugs.
	// However, it is necessary in this case due to CSS size limits.
	// It may do as long as disabled variants are not later re-enabled.
	// eg. Disabling SL1 on Sekiro, but not Elden Ring.
	{
		id: "sekiro", name: "Sekiro", variants: {
			"Main": {css_text: "Sek", css_class: "Sek", icon: "img/trophies/magenta.png"},
			// "SL1": {css_text: "Sek+", css_class: "Sek+", icon: "img/trophies/magenta+.png"}
		}
	},
	{
		id: "eldenring", name: "Elden Ring", variants: {
			"Main": {css_text: "Eld", css_class: "Eld", icon: "img/trophies/charcoal.png"},
			// "SL1": {css_text: "Eld+", css_class: "Eld+", icon: "img/trophies/charcoal+.png"}
		}
	},
	// {
	// 	id: "zz", name: "ZZ Placeholder", variants: {
	// 		"Main": {css_text: "Zz", css_class: "Zz", icon: "img/trophies/ash.png"},
	// 		"SL1": {css_text: "Zz+", css_class: "Zz+", icon: "img/trophies/ash+.png"}
	// 	}
	// },
]

export {redditApp, trophies, variants};
