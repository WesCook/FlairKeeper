export function getAuth() {
	return new snoowrap({
		userAgent: redditAuth.userAgent,
		clientId: redditAuth.clientId,
		clientSecret: redditAuth.clientSecret,
		refreshToken: redditAuth.refreshToken
	});
}
