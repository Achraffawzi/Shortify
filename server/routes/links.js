import express from "express";
const router = express.Router();
import { createLink, deleteLink } from "../controllers/links.js";
import isAuth from "../middlewares/isAuth.js";

router.post("/", isAuth, createLink);
router.delete("/:id", isAuth, deleteLink);

export default router;
