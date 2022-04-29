const bcrypt = require("bcryptjs");
const CreateError = require("http-errors");
const jwt = require("jsonwebtoken");

const { User, schemas } = require("../../service/schemas/users");
const { SECRET } = process.env;

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const findEmail = await User.findOne({ email });

    const { error } = schemas.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }

    if (findEmail) {
      throw new CreateError(409, "Email in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({ email, password: hashPassword });

    res.status(201).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schemas.validate(req.body);
  if (error) {
    throw new CreateError(400, error.message);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CreateError(401, "Email or password is wrong");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new CreateError(401, "Email or password is wrong");
    }

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin };
