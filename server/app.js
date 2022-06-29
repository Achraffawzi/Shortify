import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { handleApiError } from "./middlewares/error-handler.js";
import ApiError from "./classes/ApiError.js";
import Link from "./models/links.js";
import authRoutes from "./routes/auth.js";
import linkRoutes from "./routes/links.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);
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
