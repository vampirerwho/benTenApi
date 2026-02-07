const Alien = require("../models/alienModel");

// 📋 GET all aliens (returns all aliens without pagination)
exports.getAllAliens = async (req, res) => {
  try {
    const allowedFilters = [
      "name",
      "species",
      "homeworld",
      "series",
    ];
    const filter = {};

    // Build dynamic filter
    allowedFilters.forEach((field) => {
      if (req.query[field]) {
        filter[field] = req.query[field];
      }
    });

    // Sorting
    const allowedSort = [
      "name",
      "species",
      "homeworld",
      "_id",
    ];
    let sortField = req.query.sort || "name";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    // Validate sort field
    if (!allowedSort.includes(sortField)) {
      sortField = "name";
    }

    const sortObj = { [sortField]: sortOrder };

    // Select fields
    const fields =
      req.query.fields?.split(",").join(" ") ||
      "name slug species homeworld series firstAppearance image";

    const aliens = await Alien.find(filter)
      .select(fields)
      .sort(sortObj);

    res.status(200).json({
      status: "success",
      results: aliens.length,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 📋 GET all aliens with pagination
exports.getAllAliensPaginated = async (req, res) => {
  try {
    const allowedFilters = [
      "name",
      "species",
      "homeworld",
      "series",
    ];
    const filter = {};

    // Build dynamic filter
    allowedFilters.forEach((field) => {
      if (req.query[field]) {
        filter[field] = req.query[field];
      }
    });

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      50,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSort = [
      "name",
      "species",
      "homeworld",
      "_id",
    ];
    let sortField = req.query.sort || "name";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    // Validate sort field
    if (!allowedSort.includes(sortField)) {
      sortField = "name";
    }

    const sortObj = { [sortField]: sortOrder };

    // Select fields
    const fields =
      req.query.fields?.split(",").join(" ") ||
      "name slug species homeworld series firstAppearance image";

    const totalAliens = await Alien.countDocuments(filter);
    const aliens = await Alien.find(filter)
      .select(fields)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      pagination: {
        page,
        limit,
        total: totalAliens,
        pages: Math.ceil(totalAliens / limit),
      },
      results: aliens.length,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 🔍 GET search results with text search
exports.searchAliens = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query parameter 'q' is required",
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      50,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    // Create regex pattern for case-insensitive search
    const searchPattern = new RegExp(q, "i");

    // Search across multiple fields
    const searchFilter = {
      $or: [
        { name: searchPattern },
        { species: searchPattern },
        { homeworld: searchPattern },
        { firstAppearance: searchPattern },
        { powers: searchPattern },
        { weaknesses: searchPattern },
      ],
    };

    const totalResults =
      await Alien.countDocuments(searchFilter);
    const results = await Alien.find(searchFilter)
      .select("name slug species homeworld series image")
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      status: "success",
      pagination: {
        page,
        limit,
        total: totalResults,
        pages: Math.ceil(totalResults / limit),
      },
      results: results.length,
      searchQuery: q,
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Search failed",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 📊 GET statistics about aliens
exports.getStats = async (req, res) => {
  try {
    const stats = await Alien.aggregate([
      {
        $facet: {
          totalAliens: [{ $count: "count" }],
          speciesList: [
            {
              $group: {
                _id: "$species",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          homeworldList: [
            {
              $group: {
                _id: "$homeworld",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          seriesList: [
            { $unwind: "$series" },
            {
              $group: {
                _id: "$series",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          powersList: [
            { $unwind: "$powers" },
            {
              $group: {
                _id: "$powers",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
          ],
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalAliens: stats[0].totalAliens[0]?.count || 0,
        speciesByCount: stats[0].speciesList,
        homeworldsByCount: stats[0].homeworldList,
        seriesByCount: stats[0].seriesList,
        topPowers: stats[0].powersList,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch statistics",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 🎯 GET single alien by slug with related aliens
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
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 🔗 GET related aliens (same species or homeworld)
exports.getRelatedAliens = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = Math.min(
      10,
      parseInt(req.query.limit) || 5,
    );

    const alien = await Alien.findOne({ slug });

    if (!alien) {
      return res.status(404).json({
        status: "fail",
        message: "Alien not found",
      });
    }

    // Find aliens with same species or homeworld
    const relatedAliens = await Alien.find({
      $and: [
        { slug: { $ne: slug } },
        {
          $or: [
            { species: alien.species },
            { homeworld: alien.homeworld },
          ],
        },
      ],
    })
      .select("name slug species homeworld image")
      .limit(limit);

    res.status(200).json({
      status: "success",
      results: relatedAliens.length,
      data: {
        alien: {
          name: alien.name,
          slug: alien.slug,
          species: alien.species,
          homeworld: alien.homeworld,
        },
        relatedAliens,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch related aliens",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 🔋 GET aliens filtered by specific power
exports.getAliensByPower = async (req, res) => {
  try {
    const { power } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      50,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    if (!power) {
      return res.status(400).json({
        status: "error",
        message: "Power parameter is required",
      });
    }

    const searchPattern = new RegExp(power, "i");
    const totalAliens = await Alien.countDocuments({
      powers: searchPattern,
    });

    const aliens = await Alien.find({
      powers: searchPattern,
    })
      .select("name slug species powers image")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      pagination: {
        page,
        limit,
        total: totalAliens,
        pages: Math.ceil(totalAliens / limit),
      },
      results: aliens.length,
      searchPower: power,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens by power",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 🌍 GET aliens from specific homeworld
exports.getAliensByHomeworld = async (req, res) => {
  try {
    const { homeworld } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      50,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    if (!homeworld) {
      return res.status(400).json({
        status: "error",
        message: "Homeworld parameter is required",
      });
    }

    const searchPattern = new RegExp(homeworld, "i");
    const totalAliens = await Alien.countDocuments({
      homeworld: searchPattern,
    });

    const aliens = await Alien.find({
      homeworld: searchPattern,
    })
      .select("name slug species homeworld image")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      pagination: {
        page,
        limit,
        total: totalAliens,
        pages: Math.ceil(totalAliens / limit),
      },
      results: aliens.length,
      filterHomeworld: homeworld,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens by homeworld",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

// 📺 GET aliens from specific series
exports.getAliensBySeries = async (req, res) => {
  try {
    const { series } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      50,
      parseInt(req.query.limit) || 10,
    );
    const skip = (page - 1) * limit;

    if (!series) {
      return res.status(400).json({
        status: "error",
        message: "Series parameter is required",
      });
    }

    const searchPattern = new RegExp(series, "i");
    const totalAliens = await Alien.countDocuments({
      series: searchPattern,
    });

    const aliens = await Alien.find({
      series: searchPattern,
    })
      .select("name slug species homeworld series image")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      pagination: {
        page,
        limit,
        total: totalAliens,
        pages: Math.ceil(totalAliens / limit),
      },
      results: aliens.length,
      filterSeries: series,
      data: aliens,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch aliens by series",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};
