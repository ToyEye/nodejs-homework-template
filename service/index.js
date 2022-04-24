const Contact = require("./schemas/schemas");

const getAll = () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findById(id);
};

const createNewContact = (body) => {
  return Contact.create(body);
};

const removeContactById = (id) => {
  return Contact.findByIdAndDelete(id);
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true });
};

const updateFavorite = (id, { favorite }) => {
  return Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};

module.exports = {
  getAll,
  getContactById,
  createNewContact,
  removeContactById,
  updateContact,
  updateFavorite,
};
