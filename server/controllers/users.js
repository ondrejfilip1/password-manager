const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // details check
    if (!username || !email || !password)
      return res.status(400).json({ message: "Enter all details" });

    if (password.length < 8 || password.length > 64)
      return res
        .status(500)
        .send({ message: "Password must be 8-64 characters long" });

    // existing user check
    const emailExists = await Users.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "This email is already in use" });
    const usernameExists = await Users.findOne({ username });
    if (usernameExists)
      return res
        .status(400)
        .json({ message: "This Username is already in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new Users({
      username: username,
      email: email,
      password: passwordHash,
    });

    const result = await user.save();
    if (result) {
      // login
      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).send({
        message: "User created",
        payload: result,
        token,
      });
    }
    res.status(500).send({
      message: "User not created",
    });
  } catch (e) {
    console.log(e)
    res.status(500).send(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Enter all details" });

    const findUser = await Users.findOne({ email });
    if (!findUser) return res.status(400).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, findUser.password)))
      return res.status(400).send({
        message: "Invalid credentials",
      });

    const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      token,
      payload: findUser,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.addPassword = async (req, res, next) => {
  try {
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removePassword = async (req, res, next) => {
  try {
  } catch (e) {
    res.status(500).send(e);
  }
};
