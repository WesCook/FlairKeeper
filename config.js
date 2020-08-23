// Reddit Application information (https://www.reddit.com/prefs/apps/)
const redditApp = {
	clientId: "ftsPs2iwqWeb2A",
	userAgent: "FlairKeeper"
}

// Variants for each flair option
// Use simple names.  "Main" is required.
const variants = ["Main", "SL1"];

// Trophy list
// ID: the ID for the element
// Name: the label under the icon
// Icon: path to an image to display
// css_text: The flair code for reddit's emojis.  Automatically adds surrounding colons (eg. ":DeS::Bb::Sek:").
// css_class: The flair code to map the spritesheet entry.  Always ends in a 'T'.  Applies to old Reddit (eg. "DeBbSekT").
const trophies = [
	{
		id: "demonssouls", name: "Demon's Souls", variants: {
			"Main": {css_class: "De", css_text: "DeS", icon: "img/trophies/platinum.png"},
			"SL1": {css_class: "De-", css_text: "DeS-", icon: "img/trophies/platinum_darksign.png"}
		}
	},
	{
		id: "darksouls1", name: "Dark Souls", variants: {
			"Main": {css_class: "Da", css_text: "DaS", icon: "img/trophies/bronze.png"},
			"SL1": {css_class: "Da-", css_text: "DaS-", icon: "img/trophies/bronze_darksign.png"}
		}
	},
	{
		id: "darksouls2", name: "Dark Souls II", variants: {
			"Main": {css_class: "Da2", css_text: "DaS2", icon: "img/trophies/gold.png"},
			"SL1": {css_class: "Da2-", css_text: "DaS2-", icon: "img/trophies/gold_darksign.png"}
		}
	},
	{
		id: "bloodborne", name: "Bloodborne", variants: {
			"Main": {css_class: "Bb", css_text: "Bb", icon: "img/trophies/green.png"},
			"SL1": {css_class: "Bb-", css_text: "Bb-", icon: "img/trophies/green_darksign.png"}
		}
	},
	{
		id: "darksouls3", name: "Dark Souls III", variants: {
			"Main": {css_class: "Da3", css_text: "DaS3", icon: "img/trophies/purple.png"},
			"SL1": {css_class: "Da3-", css_text: "DaS3-", icon: "img/trophies/purple_darksign.png"}
		}
	},
	// Having gaps in variants is not a good idea, and may cause bugs.
	// However, it is necessary in this case due to CSS size limits.
	// It may do as long as disabled variants are not later re-enabled.
	// eg. Disabling SL1 on Sekiro, then re-enabling it on Elden Ring.
	{
		id: "sekiro", name: "Sekiro", variants: {
			"Main": {css_class: "Sek", css_text: "Sek", icon: "img/trophies/magenta.png"},
			// "SL1": {css_class: "Sek-", css_text: "Sek-", icon: "img/trophies/magenta_darksign.png"}
		}
	},
	{
		id: "eldenring", name: "Elden Ring", variants: {
			"Main": {css_class: "Eld", css_text: "Eld", icon: "img/trophies/charcoal.png"},
			// "SL1": {css_class: "Eld-", css_text: "Eld-", icon: "img/trophies/charcoal_darksign.png"}
		}
	},
	// {
	// 	id: "zz", name: "ZZ Placeholder", variants: {
	// 		"Main": {css_class: "Zz", css_text: "Zz", icon: "img/trophies/ash.png"},
	// 		"SL1": {css_class: "Zz-", css_text: "Zz-", icon: "img/trophies/ash_darksign.png"}
	// 	}
	// },
]

export {redditApp, trophies, variants};
