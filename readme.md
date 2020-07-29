# Souls Flair Bot

**This document is a work-in-progress.**

A web app for assigning trophy flairs.  Created for the Souls network of subreddits.

Generates a unique string based on the selected trophies.  Can be used in automatic or manual modes.  Strings can be copied manually, or automatically exported to subreddits of your choosing.

Connects via OAuth2 to your reddit account if you choose to connect it for additional functionality.

Designed with configurability in mind.  Trophies can be be added or adjusted in the `config.js` file.

### To use this instance

This instance is intended for moderators of the Souls network of subreddits.  It requires a moderator account with flair permission to work.  You can connect using the following steps:

1.


### To run your own instance

For other subreddit networks, it's easy to run your own instance of the web app and reddit app.

As all the authentication occurs using OAuth, there's no risk in publishing the URL to the internet.

This web app doesn't generally require a web server (it's all client-side).  However, browsers place limitations on the `file://` protocol which prevents this app from running locally.  As such you'll need to run a basic web server.

To get started:

1.
