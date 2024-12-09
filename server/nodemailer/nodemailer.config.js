import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_gmail@gmail.com", // Your Gmail address
    pass: "your_app_password",    // Your Gmail App Password (not your regular Gmail password)
  },
});

export default transporter;
