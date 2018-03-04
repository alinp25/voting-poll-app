module.exports = {
  'twitterAuth': {
    'consumerKey': process.env.TWITTER_KEY,
    'consumerSecret': process.env.TWITTER_SECRET, 
    'callbackURL': process.env.SYNC_URL + '/auth/twitter/callback'
  }
}