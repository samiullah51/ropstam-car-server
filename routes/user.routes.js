const { register } = require("../controllers/user.controller");

const router = require("express").Router();

// User Registration
router.post("/register", register);

module.exports = router;
