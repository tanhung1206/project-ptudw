const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  async sendActivationEmail(email, activationLink) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EShooper Activate your account",
      html: `
                <h1>Account Activation</h1>
                <p>Click the link below to activate your account:</p>
                <a href="${activationLink}">${activationLink}</a>
            `,
    };
    await transporter.sendMail(mailOptions);
  },

  async sendResetPasswordEmail(email, resetLink) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
  },
};
