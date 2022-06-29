import express from "express";
const router = express.Router();
import isAuth from "../middlewares/isAuth.js";
import { removeUser } from "../controllers/users.js";

router.delete("/:id", isAuth, removeUser);

export default router;
