const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db.js");
const { handleApiError } = require("./middlewares/error-handler.js");
const ApiError = require("./classes/ApiError.js");
const Link = require("./models/links.js");
const authRoutes = require("./routes/auth.js");
const oauthRoutes = require("./routes/oauth.js");
const linkRoutes = require("./routes/links.js");
const userRoutes = require("./routes/users.js");

dotenv.config();
const app = express();
const passportSetup = require("./config/passport.js");
const { resetPasswordPOST } = require("./controllers/auth.js");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/oauth", oauthRoutes);
app.get("/:shortid", async (req, res, next) => {
  try {
    const { shortid } = req.params;
    if (!shortid) {
      throw ApiError.BadRequest("short id is required");
    }
    const url = await Link.findOne({ short: shortid });
    if (!url) {
      throw ApiError.NotFound("url not found");
    }

    await Link.updateOne({ short: shortid }, { $inc: { totalClicks: 1 } });
    return res.redirect(url.long);
  } catch (e) {
    next(e);
  }
});

app.use(handleApiError);

// Connection
mongoose.connection.on("connected", () => console.log("connected to DB..."));
mongoose.connection.on("disconnected", () =>
  console.log("disconnected from DB")
);

// starting the server
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`server listening on port ${process.env.PORT}...`)
  );
};
start();
