const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const alienRoutes = require("./routes/alienRoutes");

const app = express();

// Hide Express fingerprint
app.disable("x-powered-by");

// Secure HTTP headers
app.use(helmet());

// Body limit (anti payload abuse)
app.use(express.json({ limit: "10kb" }));

// CORS (lock to frontend later if needed)
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  }),
);

// Rate limiting (anti spam / brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // per IP
  message: "Too many requests, slow down 🛑",
});
app.use("/api", limiter);

// Prevent NoSQL injection
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

// Prevent XSS
app.use(xss());

// Prevent HTTP param pollution
app.use(hpp());

app.use("/api/v1/aliens", alienRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = app;
