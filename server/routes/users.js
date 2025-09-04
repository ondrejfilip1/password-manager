const express = require("express");
const router = express.Router();
const usersRouter = require("../controllers/users");
const auth = require("../middlewares/auth");

// Login and register

router.post("/login", usersRouter.login);

router.post("/register", usersRouter.register);

// OTP verification

router.post("/verify-otp", usersRouter.verifyOTP);

// Passwords

router.post("/get-passwords", auth, usersRouter.getPasswords);

router.post("/add-password", auth, usersRouter.addPassword);

router.post("/remove-password/:id", auth, usersRouter.removePassword);

module.exports = router;
