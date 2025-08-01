const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODEMAILER_CODE_SENDING_PASSWORD,
  }
})

module.exports = transport;
