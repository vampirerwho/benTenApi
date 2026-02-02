const mongoose = require("mongoose");
const fs = require("fs");
const Alien = require("./src/models/alienModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const aliens = JSON.parse(
  fs.readFileSync("./data/aliens.json", "utf-8")
);

async function seedData() {
  try {
    await Alien.deleteMany();
    await Alien.insertMany(aliens);
    console.log("Aliens seeded successfully 🌱");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seedData();
