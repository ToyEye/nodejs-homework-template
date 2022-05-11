const { Schema, model } = require("mongoose");
const Joi = require("joi");

const subscriptions = ["starter", "pro", "business"];

const user = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptions,
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerJoiSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const subscriptionJoiSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptions)
    .required(),
});

const schemas = {
  registerJoiSchema,
  subscriptionJoiSchema,
};

const User = model("user", user);

module.exports = { User, schemas };
