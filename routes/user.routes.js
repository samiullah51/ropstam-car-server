const { register, login } = require("../controllers/user.controller");

const router = require("express").Router();

// User Registration
router.post("/register", register);
// User Login
router.post("/login", login);

module.exports = router;
