const mongoose = require("mongoose");
const User = require("./users.js");

const LinkSchema = new mongoose.Schema({
  long: {
    type: String,
    match: [
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
      "invalid URL",
    ],
    required: true,
    trim: true,
  },
  short: {
    type: String,
    required: true,
    trim: true,
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

LinkSchema.post("save", async function () {
  // save link to user's links
  await User.findByIdAndUpdate(this.createdBy, {
    $push: {
      links: this._id,
    },
  });
});

LinkSchema.pre("remove", { document: true, query: false }, async function () {
  // remove link from user's links
  await User.findByIdAndUpdate(this.createdBy, {
    $pull: {
      links: this._id,
    },
  });
});

module.exports = mongoose.model("link", LinkSchema);
