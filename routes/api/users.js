const express = require("express");
const { users } = require("../../controller/");

const router = express.Router();

router.post("/signup", users.signup);
router.post("/signin", users.signin);

module.exports = router;
