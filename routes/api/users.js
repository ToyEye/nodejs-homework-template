const express = require("express");
const { users } = require("../../controller/");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/signup", users.signup);
router.post("/signin", users.signin);
router.get("/current", auth, users.current);
router.get("/logout", auth, users.logout);
router.patch("/:userId/subscription", auth, users.changeSubscription);

module.exports = router;
