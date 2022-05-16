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
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
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

const verifyJoiSchema = Joi.object({
  email: Joi.string().required(),
});

const schemas = {
  registerJoiSchema,
  subscriptionJoiSchema,
  verifyJoiSchema,
};

const User = model("user", user);

module.exports = { User, schemas };
