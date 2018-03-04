const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  title: {
    type: String
  },
  authorID: {
    type: String
  },
  labels: [String],
  votes: [Number],
  usersVoted: [String],
  ipsVoted: [String]
});

module.exports = mongoose.model('Poll', pollSchema);