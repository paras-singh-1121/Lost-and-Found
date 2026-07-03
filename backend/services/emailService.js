import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"TMU Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Lost & Found OTP Verification",
    html: `
      <div style="font-family: Arial">
        <h2>TMU Lost & Found</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `,
  });
};