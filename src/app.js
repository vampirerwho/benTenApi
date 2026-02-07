const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const xss = require("xss-clean");
const hpp = require("hpp");

const alienRoutes = require("./routes/alienRoutes");

const app = express();

// 🔑 REQUIRED FOR RENDER / RATE LIMIT
app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(cors({ origin: "*", methods: ["GET"] }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// Security
app.use(xss());
app.use(hpp());

app.use("/api/v1/aliens", alienRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

module.exports = app;
