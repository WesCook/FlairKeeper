# Flair Keeper

A web app for assigning trophy flairs.  Created for the Souls network of subreddits.

Generates a unique string based on the selected trophies.  Can be used in automatic or manual modes.  Strings can be copied manually, or automatically exported to subreddits of your choosing.

Connects via OAuth2 to your reddit account, should you choose to connect it for additional functionality.

Designed with configurability in mind.  Trophies can be be added or adjusted in the `config.js` file.  A variants system exists to allow upgrades or alternate versions of trophies (eg. an "SL1" variant).

Finally, a spritesheet generator has been included.  This will generate both the spritesheet image and CSS for all possible permutations of trophies and their variants.  These numbers grow exponentially, so consider minimizing the number of variants.  The number of permutations will be `((variants + 1) ^ trophies) - 1`.

Append `?debug` to the URL to show additional information.

### To use this instance

This instance is intended for moderators of the Souls network of subreddits.  It requires a moderator account with flair permission to work.  You can connect using the following steps:

1. Go to [the web app](https://wescook.ca/FlairKeeper/) and click Connect.
2. You can use either your real account, or a shared mod account with limited permissions.  The latter is preferred if sharing between multiple mod teams.
3. Select your preferred import and export subreddits.

This tool won't allow you to set flairs unless you already have flair permission.  It runs entirely client-side, and isn't exposing anything sensitive.

### To run your own instance

For other subreddit networks, it's easy to run your own instance of the web app.  As all the authentication occurs using client-side OAuth, there's no risk in publishing the URL to the internet.

While this is entirely written in JavaScript, browsers place limitations on the `file://` protocol which prevents this app from running locally.  As such you'll need to run a basic web server.  No server-side language is required.

To get started:

1. Fork or download this repo.  Upload the files to a web server.
2. [Create a reddit app](https://www.reddit.com/prefs/apps/) of type `installed app`.  Make note of the ID.  Set the Redirect URI to the web app's settings page.  eg. `https://example.com/FlairKeeper/settings.html`.
3. Edit `config.js` to enter your user agent and app ID.  Trophies can also be adjusted here.
