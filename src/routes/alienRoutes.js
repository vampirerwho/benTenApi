const express = require("express");
const alienController = require("../controllers/alienController");

const router = express.Router();

// 📊 Statistics and data aggregation
router.get("/stats", alienController.getStats);

// 🔍 Search functionality
router.get("/search", alienController.searchAliens);

// � Get all aliens with pagination (use this to paginate results)
router.get(
  "/paginated",
  alienController.getAllAliensPaginated,
);

// 🔋 Get aliens by power
router.get(
  "/power/:power",
  alienController.getAliensByPower,
);

// 🌍 Get aliens by homeworld
router.get(
  "/homeworld/:homeworld",
  alienController.getAliensByHomeworld,
);

// 📺 Get aliens by series
router.get(
  "/series/:series",
  alienController.getAliensBySeries,
);

// 📋 Get all aliens (returns all without pagination)
router.get("/", alienController.getAllAliens);

// 🔗 Get related aliens (same species/homeworld)
router.get(
  "/:slug/related",
  alienController.getRelatedAliens,
);

// 🎯 Get single alien by slug with details
router.get("/:slug", alienController.getAlienBySlug);

module.exports = router;
