const express = require("express");

const contactsHelpers = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const allContacts = await contactsHelpers.listContacts();
  res.status(200).json({ message: "template message", allContacts });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsHelpers.getContactById(contactId);

  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json({ message: "template message", contact });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
