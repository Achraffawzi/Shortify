import express from "express";
const router = express.Router();
import {
  signup,
  confirmAccount,
  login,
  changePassword,
  forgotPassword,
  resetPasswordGET,
  resetPasswordPOST,
  genAccessToken,
} from "../controllers/auth.js";
import isAuth from "../middlewares/isAuth.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/refreshtoken", genAccessToken);
router.get("/resetpassword/:id/:token", resetPasswordGET);
router.post("/resetpassword/:id/:token", resetPasswordPOST);
router.get("/confirmaccount/:id/:token", confirmAccount);
router.post("/changepassword/:id", isAuth, changePassword);

export default router;
