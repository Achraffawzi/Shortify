import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendConfirmationEmail = (user) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //   Create the confirmation URL
  const emailToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
  const url = `${process.env.BASE_URL}/api/auth/confirmaccount/${user.userId}/${emailToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: `<${user.email}>`,
    subject: "Confirmation email",
    html: `Please click on this link to confirm your account <a href="${url}">${url}</a>`,
  };

  // Sending the email
  transport.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err);
    else console.log("email was sent successfully " + data);
  });
};

export const sendResetPasswordEmail = (user) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //   Create the confirmation URL
  const emailToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
  const url = `${process.env.BASE_URL}/api/auth/resetpassword/${user.userId}/${emailToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: `<${user.email}>`,
    subject: "Reset password email",
    html: `Please click on this link to reset your password <a href="${url}">${url}</a>`,
  };

  // Sending the email
  transport.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err);
    else console.log("email was sent successfully " + data);
  });
};
