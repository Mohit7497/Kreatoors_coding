const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  });
};