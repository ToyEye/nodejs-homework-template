const express = require("express");

const ctrlContact = require("../../controller");

const router = express.Router();

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.createContact);

router.delete("/:contactId", ctrlContact.deleteContact);

router.put("/:contactId", ctrlContact.updateContact);

router.patch("/:contactId/favorite", ctrlContact.updateFavorite);

module.exports = router;
