const nodemailer = require("nodemailer");

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "alexey.korotenko90@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "alexey.korotenko90@meta.ua" };
  try {
    await transporter.sendMail(email);
    console.log("Email send");
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
