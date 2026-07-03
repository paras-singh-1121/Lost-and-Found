import express from "express";
import dotenv from "dotenv";
import { sendOtpEmail } from "../services/emailService.js";
// import sgMail from "@sendgrid/mail";

dotenv.config();  

const router = express.Router();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log("API KEY USED IN OTP ROUTE:", process.env.SENDGRID_API_KEY);

const otpStore = {};

// router.post("/send", async (req, res) => {
//   const { email } = req.body;
//   console.log("Send OTP Request Body:", req.body);

//   if (!email || !email.endsWith("@tmu.ac.in"))
//     return res.status(400).json({ message: "Only TMU email allowed" });

//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
// // DEVELOPMENT MODE — log OTP instead of sending email
//   console.log("====================================");
//   console.log("OTP for", email, "is:", otp);
//   console.log("Expires in 5 minutes");
//   console.log("====================================");

//   res.json({
//     message: "OTP generated (check backend console)",
//   });
// });
//   try {
//     await sgMail.send({
//       to: email,
//       from: process.env.EMAIL_FROM,
//       subject: "Lost & Found Registration OTP",
//       text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
//     });

//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("SendGrid Error:", err.response?.body || err);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// });

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith("@tmu.ac.in")) {
      return res
        .status(400)
        .json({ message: "Only TMU email allowed" });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    );

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendOtpEmail(email, otp);

    res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
});


router.post("/verify", (req, res) => {
  const { email, otp } = req.body;


  if (!otpStore[email]) {
    return res.status(400).json({ message: "OTP not sent" });
  }

  const { otp: correctOtp, expires } = otpStore[email];

  if (Date.now() > expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) !== correctOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
});

export default router;
