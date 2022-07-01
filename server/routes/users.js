const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth.js");
const { removeUser } = require("../controllers/users.js");

router.delete("/:id", isAuth, removeUser);

module.exports = router;
