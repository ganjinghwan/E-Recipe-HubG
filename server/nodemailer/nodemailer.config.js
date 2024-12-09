import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "process.env.SMTP_USER", // Your Gmail address
    pass: "process.env.SMTP_PASSWORD",    // Your Gmail App Password (not your regular Gmail password)
  },
});

export default transporter;
