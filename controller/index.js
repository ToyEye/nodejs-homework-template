const service = require("../service/index");
const Joi = require("joi");

const get = async (req, res, next) => {
  try {
    const result = await service.getAll();
    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await service.getContactById(contactId);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(15).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      phone: Joi.string().min(3).max(15).required(),
    });

    const validateResult = schema.validate(req.body);
    if (validateResult.error) {
      res.status(400).json({ message: validateResult.error.details });
      return;
    }
    const newContact = req.body;
    const result = await service.createNewContact(newContact);
    if (!result) {
      res.status(404).json({ message: "bad request" });
    }

    res.status(201).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await service.removeContactById(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "deletion successful", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;

    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(15).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      phone: Joi.string().min(3).max(15).required(),
    });

    const validateResult = schema.validate(req.body);
    if (validateResult.error) {
      res.status(400).json({ message: validateResult.error.details });
      return;
    }

    if (!body) {
      res.status(400).json({ message: "missing fields" });
    }

    const result = await service.updateContact(contactId, body);

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const schema = Joi.object({
      favorite: Boolean,
    });

    const validateResult = schema.validate(req.body);
    if (validateResult.error) {
      res.status(400).json({ message: validateResult.error.details });
      return;
    }

    if (!req.body) {
      res.status(400).json({ message: "missing fields" });
    }

    const result = await service.updateFavorite(contactId, { favorite });

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  get,
  getById,
  createContact,
  deleteContact,
  updateContact,
  updateFavorite,
};
