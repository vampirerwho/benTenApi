const express = require("express");
const alienController = require("../controllers/alienController");

const router = express.Router();

// Route to get all aliens
router.get("/", alienController.getAllAliens);

// Route to get single alien by slug
router.get("/:slug", alienController.getAlienBySlug);

module.exports = router;
