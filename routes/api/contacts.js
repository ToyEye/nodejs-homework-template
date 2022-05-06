const express = require("express");

const ctrlContact = require("../../controller/contacts");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/", auth, ctrlContact.get);

router.get("/:contactId", auth, ctrlContact.getById);

router.post("/", auth, ctrlContact.createContact);

router.delete("/:contactId", auth, ctrlContact.deleteContact);

router.put("/:contactId", auth, ctrlContact.updateContact);

router.patch("/:contactId/favorite", auth, ctrlContact.updateFavorite);

module.exports = router;
