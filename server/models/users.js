const mongoose = require("mongoose");
const validator = require("../utils/validators");

const passwordsSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      validate: [validator.validateUrl, "Please fill a valid URL address"],
    },
    password: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      reqired: false,
    },
  },
  { timestamps: true }
);

const usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 64,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validator.validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true },
    savedPasswords: {
      type: [passwordsSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);
