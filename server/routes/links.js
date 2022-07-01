const express = require("express");
const router = express.Router();
const { createLink, deleteLink } = require("../controllers/links.js");
const isAuth = require("../middlewares/isAuth.js");

router.post("/", isAuth, createLink);
router.delete("/:id", isAuth, deleteLink);

module.exports = router;
