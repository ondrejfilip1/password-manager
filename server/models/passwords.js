const mongoose = require("mongoose");
const validator = require("../utils/validators");

const schema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      validate: [validator.validateUrl, "Please fill a valid URL address"],
    },
    password: {
      type: String,
      required: true
    },
    note: {
      type: String,
      reqired: false
    }
  },
  { timestamps: true }
);

model.exports = mongoose.model("Passwords", schema);
