const mongoose = require("mongoose");

const alienSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  species: String,
  homeworld: String,
  powers: [String],
  weaknesses: [String],
  series: [String],
  firstAppearance: String,
});

module.exports = mongoose.model("Alien", alienSchema);
