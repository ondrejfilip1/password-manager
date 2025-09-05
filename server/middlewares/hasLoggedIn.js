const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(500).send({ message: "Access denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.stage !== "OTP")
      return res.status(400).json({ message: "Not in OTP stage" });

    next();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
