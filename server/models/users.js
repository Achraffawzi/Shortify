const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Link = require("./links.js");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    googleID: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      required: false,
    },
    links: [{ type: mongoose.Types.ObjectId, ref: "link" }],
  },
  { timestamps: true }
);

// hashing the password
// UserSchema.pre("save", async function () {
//   console.log("password : ", this.password);
//   if (this.password !== "" || this.password !== undefined || this.password) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
// });

UserSchema.pre("remove", { document: true, query: false }, async function () {
  await Link.deleteMany({ user: this._id });
});

UserSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.genToken = function (payload, secret, expiration) {
  return jwt.sign(payload, secret, { expiresIn: expiration });
};

module.exports = mongoose.model("user", UserSchema);
