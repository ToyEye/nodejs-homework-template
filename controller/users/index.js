const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const { createError, handleJimp, sendEmail } = require("../../helpers");
const { User } = require("../../service/schemas/users");
const { SECRET } = process.env;

const avatarPath = path.join(__dirname, "../../", "public", "avatars");

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const findEmail = await User.findOne({ email });

    if (findEmail) {
      throw createError(409, "Email in use");
    }

    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const mail = {
      to: email,
      subject: "Подтверждения email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить email</a>`,
    };

    await sendEmail(mail);

    res.status(201).json({
      user: {
        email,
        verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw createError(401, "User not verified ");
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
    const { originalname, path: tempPath } = req.file;

    const [extension] = originalname.split(".").reverse();

    const fileName = `${id}.${extension}`;
    const resultUpload = path.join(avatarPath, fileName);
    await handleJimp(tempPath);

    await fs.rename(tempPath, resultUpload);

    const avatarURL = path.join("avatars", fileName);

    if (!id) {
      throw createError(401);
    }

    await User.findByIdAndUpdate(id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw createError(404, "User not found");
    }

    await User.findOneAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    if (user.verify) {
      throw createError(404);
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const reverifyEmailToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(400);
    }

    if (user.verify) {
      throw createError(400, "Verification has already been passed");
    }

    const mail = {
      to: email,
      subject: "Подтверждения email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Подтвердить email</a>`,
    };

    await sendEmail(mail);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
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
  verifyEmail,
  reverifyEmailToken,
};
