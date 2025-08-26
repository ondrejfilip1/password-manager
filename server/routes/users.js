const express = require("express");
const router = express.Router();
const usersRouter = require("../controllers/users");

router.post("/login", usersRouter.login);

router.post("/register", usersRouter.register);

module.exports = router;
