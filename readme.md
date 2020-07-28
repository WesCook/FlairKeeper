# Souls Flair Bot

A bot and web app for assigning trophy flairs on the Souls subreddits.

Generates a unique string based on the combination of inputs.  Supports importing and exporting of specific user flairs, or manual copying methods.

Designed to be as configurable as possible.  Could work with other flair programs if designed around a string combination system.

### Run your own instance

The web app doesn't generally require a web server (it's all client-side).  However, browsers place limitations on the `file://` protocol which prevents this app from running locally.  As such you'll need to run a basic web server.

If hosting online, do not publish the app URL or config file as these contain your secret keys.  They are for personal use only, or that of a trusted mod team.

To get started:

1. Copy `config.sample.js` in the root to `config.js`.
2. (Optional) Create an account for your flair bot.  The account must be a moderator with flair permission on any subreddits it accesses (required for importing/exporting).
3. [Create an app](https://www.reddit.com/prefs/apps/) of type `web app` and redirect URL `https://not-an-aardvark.github.io/reddit-oauth-helper/`.  The redirect URL can be adjusted afterwards.
4. Use [Reddit OAuth Helper](https://not-an-aardvark.github.io/reddit-oauth-helper/) to assist in generating tokens.  Enter your Client ID and secret, and check Permanent.  Check `modflair` and `mysubreddits` under scope.
5. Click Generate Tokens.  Confirm the app is connected, and record the refresh token near the bottom of the page.
6. Copy client ID, secret, and refresh token into config.js.
