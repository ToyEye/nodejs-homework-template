const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const createError = require("../../helpers");
const { User, schemas } = require("../../service/schemas/users");
const { SECRET } = process.env;

const avatarPath = path.join(__dirname, process.cwd(), "public", "avatars");

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const findEmail = await User.findOne({ email });

    const { error } = schemas.registerJoiSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }

    if (findEmail) {
      throw createError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({ email, password: hashPassword, avatarURL });

    res.status(201).json({
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schemas.registerJoiSchema.validate(req.body);
  if (error) {
    throw createError(400, error.message);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Email or password is wrong");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw createError(401, "Email or password is wrong");
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });

    if (!_id) {
      throw createError(401);
    }

    res.status(204).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

const changeSubscription = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { userId } = req.params;
    const { subscription } = req.body;

    const { error } = schemas.subscriptionJoiSchema.validate({ subscription });

    if (error) {
      throw createError(400, error.message);
    }

    if (!req.body) {
      throw createError(400, "missing fields");
    }

    const result = await User.findOneAndUpdate(
      { _id: userId, owner },
      { subscription },
      {
        new: true,
      }
    );
    if (!result) {
      throw createError(404);
    }

    res.status(200).json({ message: "success", result });
  } catch (error) {
    next(error);
  }
};

const upload = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const { originalName, path: tempPath } = req.file;
    const [extension] = originalName.split(".").reverse();

    Jimp.read(originalName, (err, originalName) => {
      if (err) {
        throw createError(400, "Set dimension 250*250");
      }
      originalName.resize(250, 250);
    });

    const fileName = `${id}.${extension}`;
    const resultUpload = path.join(avatarPath, fileName);
    await fs.rename(tempPath, resultUpload);

    const avatarURL = path.join("avatars", fileName);
    if (fileName) {
      throw createError(401);
    }
    await User.findByIdAndUpdate({ id, avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
};
module.exports = {
  signup,
  signin,
  current,
  logout,
  changeSubscription,
  upload,
};
