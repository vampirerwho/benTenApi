const mongoose = require("mongoose");

const alienSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  species: { type: String },
  homeworld: { type: String },
  powers: [{ type: String }],
  weaknesses: [{ type: String }],
  series: [{ type: String }],
  firstAppearance: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Alien", alienSchema);
