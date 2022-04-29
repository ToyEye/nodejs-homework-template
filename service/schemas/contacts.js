const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contact = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const changeContactsJoiSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(15).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(3).max(15).required(),
});

const changeValidateJoiSchema = Joi.object({
  favorite: Boolean,
});

const schemas = { changeContactsJoiSchema, changeValidateJoiSchema };

const Contact = model("contact", contact);

module.exports = { Contact, schemas };
