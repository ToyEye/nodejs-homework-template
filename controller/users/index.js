const User = require("../../service/schemas/users");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const findEmail = await User.findOne({ email });

    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validateResult = schema.validate(req.body);
    if (validateResult.error) {
      res.status(400).json({ message: validateResult.error.details });
      return;
    }

    if (findEmail) {
      res.status(409).json({ message: "Email in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({ email, password: hashPassword });

    res.status(201).json({
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup };
