const express = require("express");
const { users } = require("../../controller/");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const { schemas } = require("../../service/schemas/users");
const validation = require("../../middlewares/validation");
const router = express.Router();

router.post("/signup", validation(schemas.registerJoiSchema), users.signup);
router.post("/signin", validation(schemas.registerJoiSchema), users.signin);
router.get("/current", auth, users.current);
router.get("/logout", auth, users.logout);
router.patch(
  "/:userId/subscription",
  auth,
  validation(schemas.subscriptionJoiSchema),
  users.changeSubscription
);
router.get("/verify/:verificationToken", users.verifyEmail);
router.post(
  "/verify",
  validation(schemas.verifyJoiSchema),
  users.reverifyEmailToken
);

router.patch("/avatars", auth, upload.single("avatar"), users.upload);

module.exports = router;
