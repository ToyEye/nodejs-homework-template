const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");
const contactPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactPath);
  const allContacts = JSON.parse(data);

  return allContacts;
};

const getContactById = async (contactId) => {
  const allContacts = await listContacts();

  const [contact] = allContacts.filter((item) => item.id === contactId);

  if (!contact) {
    return null;
  }

  return contact;
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();

  const idx = allContacts.findIndex((item) => item.id === contactId);

  if (idx === -1) {
    return null;
  }

  const newContacts = allContacts.filter((_, index) => index !== idx);
  await fs.writeFile(contactPath, JSON.stringify(newContacts));

  return allContacts[idx];
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = { id: nanoid(), ...body };
  allContacts.push(newContact);

  await fs.writeFile(contactPath, JSON.stringify(allContacts));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();

  const idx = allContacts.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const updateContacts = { ...allContacts[idx], ...body };
  allContacts[idx] = updateContacts;

  await fs.writeFile(contactPath, JSON.stringify(allContacts));

  return updateContacts;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
