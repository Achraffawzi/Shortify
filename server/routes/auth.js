const express = require("express");
const router = express.Router();
const {
  signup,
  confirmAccount,
  login,
  changePassword,
  forgotPassword,
  resetPasswordGET,
  resetPasswordPOST,
  genAccessToken,
} = require("../controllers/auth.js");

const isAuth = require("../middlewares/isAuth.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/refreshtoken", genAccessToken);
router.get("/resetpassword/:id/:token", resetPasswordGET);
router.post("/resetpassword/:id/:token", resetPasswordPOST);
router.get("/confirmaccount/:id/:token", confirmAccount);
router.post("/changepassword/:id", isAuth, changePassword);

module.exports = router;
