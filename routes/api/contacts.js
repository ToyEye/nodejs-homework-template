const express = require("express");
const Joi = require("joi");
const contactsHelpers = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const allContacts = await contactsHelpers.listContacts();
  res.status(200).json({ message: "success", allContacts });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsHelpers.getContactById(contactId);

  if (!contact) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "success", contact });
});

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().alphanum().min(3).max(15).required(),
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    res.status(400).json({ message: validateResult.error.details });
    return;
  }
  const newContact = req.body;

  const contact = await contactsHelpers.addContact(newContact);

  if (!contact) {
    res.status(404).json({ message: "bad request" });
  }

  res.status(201).json({ message: "success", contact });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contactsHelpers.removeContact(contactId);

  if (!deletedContact) {
    res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ message: "deletion successful", deletedContact });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;

  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().alphanum().min(3).max(15).required(),
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    res.status(400).json({ message: validateResult.error.details });
    return;
  }

  if (!body) {
    res.status(400).json({ message: "missing fields" });
  }

  const changedContact = await contactsHelpers.updateContact(contactId, body);

  if (!changedContact) {
    res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ message: "template message", changedContact });
});

module.exports = router;
