const User = require("../models/users.js");

const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.remove({ _id: id });
    // exports.redirect(`${process.env.CLIENT_URL}/`)
    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = { removeUser };
