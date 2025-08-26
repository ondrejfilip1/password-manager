const express = require("express");
const router = express.Router();
const usersRouter = require("../controllers/users");

router.post("/login", usersRouter.login);

router.post("/register", usersRouter.register);

router.post("/add-password", usersRouter.addPassword);

router.post("/remove-password", usersRouter.removePassword);

module.exports = router;
