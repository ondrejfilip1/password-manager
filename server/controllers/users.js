const Users = require("../models/users");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // details check
    if (!username || !email || !password)
      return res.status(400).json({ message: "Enter all details" });

    // existing user check
    const emailExists = await Users.findOne({ email: email });
    if (emailExists)
      return res.status(400).json({ message: "This email is already in use" });
    const usernameExists = await Users.findOne({ username: username });
    if (usernameExists)
      return res
        .status(400)
        .json({ message: "This Username is already in use" });

    
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Enter all details" });
  } catch (e) {
    res.status(500).send(e);
  }
};
