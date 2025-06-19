const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendReminderMail = async (toEmail, handle) => {
  await transporter.sendMail({
    from: `"Codeforces Tracker" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Time to Solve Some Problems!",
    html: `
      <p>Hey <strong>${handle}</strong>,</p>
      <p>We noticed you haven't submitted any problems in the last 7 days.</p>
      <p>Hop back on and keep your streak alive!</p>
    `,
  });
};

module.exports = sendReminderMail;
