const Alien = require("../models/alienModel");

// GET all aliens (secured)
exports.getAllAliens = async (req, res) => {
  try {
    const allowedFilters = [
      "name",
      "species",
      "homeworld",
      "series",
    ];
    const filter = {};

    allowedFilters.forEach((field) => {
      if (req.query[field]) {
        filter[field] = req.query[field];
      }
    });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      20,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    const allowedSort = ["name", "species", "homeworld"];
    let sort = "name";

    if (allowedSort.includes(req.query.sort)) {
      sort = req.query.sort;
    }

    const fields =
      req.query.fields?.split(",").join(" ") ||
      "name slug species homeworld series images";

    const aliens = await Alien.find(filter)
      .select(fields)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      page,
      results: aliens.length,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens",
    });
  }
};

exports.getAlienBySlug = async (req, res) => {
  try {
    const alien = await Alien.findOne({
      slug: req.params.slug,
    }).select("-__v");

    if (!alien) {
      return res.status(404).json({
        status: "fail",
        message: "Alien not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: alien,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch alien",
    });
  }
};
