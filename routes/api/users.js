const express = require("express");
const { users } = require("../../controller/");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");

const router = express.Router();

router.post("/signup", users.signup);
router.post("/signin", users.signin);
router.get("/current", auth, users.current);
router.get("/logout", auth, users.logout);
router.patch("/:userId/subscription", auth, users.changeSubscription);

router.patch("./upload", auth, upload.single("avatars"), users.upload);

module.exports = router;
