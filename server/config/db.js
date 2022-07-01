const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { connectDB };
