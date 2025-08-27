const Users = require("../models/users");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(500).send({ message: "Access denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(verified.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (e) {
    res.status(500).send(e);
  }
};
