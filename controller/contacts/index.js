const { Contact, schemas } = require("../../service/schemas/contacts");
const createError = require("../../helpers/");

const get = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const result = await Contact.find({ owner: _id }, null, {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id name email");

    res.status(200).json({ message: "success", data: { result } });
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId, owner });
    if (!result) {
      throw createError(404);
    }
    res.status(200).json({ message: "success", result });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { error } = schemas.changeContactsJoiSchema.validate(req.body);

    if (error) {
      throw createError(400, error.message);
    }

    const newContact = req.body;
    const result = await Contact.create({ ...newContact, owner: _id });

    if (!result) {
      throw createError(404);
    }

    res.status(201).json({ message: "success", result });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const { contactId } = req.params;
    const result = await Contact.deleteOne({ _id: contactId, owner });

    if (!result) {
      throw createError(404);
    }

    res.status(200).json({ message: "deletion successful", result });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const { contactId } = req.params;
    const { body } = req;

    const { error } = schemas.changeContactsJoiSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }

    if (!body) {
      throw createError(400, "missing fields");
    }

    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      body,
      {
        new: true,
      }
    );

    if (!result) {
      throw createError(404);
    }

    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const { favorite } = req.body;

    const { error } = schemas.changeValidateJoiSchema.validate({ favorite });
    if (error) {
      throw createError(400, error.message);
    }

    if (!req.body) {
      throw createError(400, "missing fields");
    }

    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      { favorite },
      { new: true }
    );

    if (!result) {
      throw createError(404);
    }

    res.status(200).json({ message: "success", result });
  } catch (error) {
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
