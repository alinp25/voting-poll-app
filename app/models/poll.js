const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  title: {
    type: String
  },
  authorID: {
    type: String
  },
  options: [
    {
      option: {
        type: String
      },
      votes: Number
    }
  ]
});

module.exports = mongoose.model('Poll', pollSchema);