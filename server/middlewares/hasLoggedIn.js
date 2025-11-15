const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(500).send({ message: "Access denied" });

    let verified;
    try {
        verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(400).json({ message: "Verifikační kód vypršel" });
    }

    if (verified.stage !== "OTP")
      return res.status(400).json({ message: "Not in OTP stage" });

    next();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
