const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { encryptSymmetric, decryptSymmetric } = require("../utils/crypto");

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const nodemailer = require("nodemailer");
const randomize = require("randomatic");
const fs = require("fs");

// login/register

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // details check
    if (!username || !email || !password)
      return res.status(400).json({ message: "Zadejte všechny detaily" });

    if (password.length < 8 || password.length > 64)
      return res
        .status(500)
        .send({ message: "Heslo musí být 8-64 znaků dlouhé" });

    // existing user check
    const emailExists = await Users.findOne({ email });
    if (emailExists)
      return res
        .status(400)
        .json({ message: "Tento email je již zaregistrován" });
    const usernameExists = await Users.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "Toto jméno bylo již použito" });

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
    console.log(e);
    res.status(500).send(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Zadejte všechny detaily" });

    const findUser = await Users.findOne({ email });
    if (!findUser)
      return res.status(400).json({ message: "Uživatel nenalezen" });

    if (!(await bcrypt.compare(password, findUser.password)))
      return res.status(400).send({
        message: "Neplatné údaje",
      });

    const otp = randomize("0", 6);
    findUser.otp = otp;
    // 1 min expiration
    findUser.otpExpiresIn = Date.now() + 60000;
    findUser.save();

    sendOTP(email, otp);

    // otp token (also 1 min)
    const token = jwt.sign(
      { id: findUser._id, stage: "OTP" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    return res.status(200).send({
      message: "Logged in successfully, waiting for OTP verification",
      token,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

// Passwords

exports.getPasswords = async (req, res, next) => {
  try {
    const savedPasswords = req.user.savedPasswords.map((item) => ({
      ...item.toObject(),
      password: decryptSymmetric(JSON.parse(item.password)),
    }));
    res.status(200).send({
      payload: savedPasswords,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.addPassword = async (req, res, next) => {
  try {
    const { url, password, note } = req.body;
    if (!url || !password)
      return res.status(400).json({ message: "Invalid format" });

    const user = req.user;

    const encrypted = encryptSymmetric(password);

    user.savedPasswords.push({
      url,
      password: JSON.stringify(encrypted),
      note,
    });

    const result = await user.save();

    if (result) {
      const savedPasswords = req.user.savedPasswords.map((item) => ({
        ...item.toObject(),
        password: decryptSymmetric(JSON.parse(item.password)),
      }));

      return res.status(200).send({
        message: "Password saved",
        payload: savedPasswords,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).send({ message: "ID of password is required" });

    const user = req.user;
    user.savedPasswords = user.savedPasswords.filter(
      (item) => item._id.toString() !== id
    );
    const result = await user.save();
    if (result) {
      return res.status(200).send({
        message: "Password removed",
        payload: user.savedPasswords,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

// OTP stuff

exports.verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP not provided" });

    const findUser = await Users.findOne({ otp });
    if (!findUser) return res.status(400).json({ message: "Zadán špatný kód" });

    if (findUser.otpExpiresIn < Date.now())
      return res.status(400).json({ message: "Verifikační kód vypršel" });

    //console.log(findUser);
    findUser.otp = "";
    findUser.otpExpiresIn = "";
    await findUser.save();

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      token,
      payload: findUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pass.manager.help.email@gmail.com",
        pass: GMAIL_APP_PASSWORD,
      },
    });

    fs.readFile("./email/otp.html", { encoding: "utf-8" }, async (e, html) => {
      if (e) return console.error(e);

      html = html.replace("${otp}", otp);

      const mailOptions = {
        from: {
          name: "Manažér hesel",
          address: "pass.manager.help.email@gmail.com",
        },
        to: email,
        subject: "Dvoufázová verifikace",
        html: html,
        text: `Váš verifikační kód je ${otp}`,
        headers: {
          "x-priority": "1",
          "x-msmail-priority": "High",
          importance: "high",
        },
      };

      await transporter.sendMail(mailOptions);
      //console.log("Email sent: " + info.response);
    });
  } catch (e) {
    console.error(e);
  }
};
