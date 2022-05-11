const express = require("express");

const ctrlContact = require("../../controller/contacts");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

const validation = require("../../middlewares/validation");
const { schemas } = require("../../service/schemas/contacts");

router.get("/", auth, ctrlContact.get);

router.get("/:contactId", auth, ctrlContact.getById);

router.post(
  "/",
  auth,
  validation(schemas.contactsJoiSchema),
  ctrlContact.createContact
);

router.delete("/:contactId", auth, ctrlContact.deleteContact);

router.put(
  "/:contactId",
  auth,
  validation(schemas.contactsJoiSchema),
  ctrlContact.updateContact
);

router.patch(
  "/:contactId/favorite",
  auth,
  validation(schemas.changeValidateJoiSchema),
  ctrlContact.updateFavorite
);

module.exports = router;
