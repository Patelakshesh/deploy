import cron from "node-cron";
import nodemailer from "nodemailer";
import { User } from "../models/User.models.js";
import mongoose from "mongoose";

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, fullname) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
            <h2>Hello ${fullname},</h2>
            <p>Thank you for joining our platform! We're excited to have you.</p>
            <p>Feel free to explore and let us know if you need help.</p>
            <br/>
            <p>Best Regards,</p>
            <p>User Management</p>
          `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("0 * * * *", async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const users = await User.find({
      createdAt: { $lte: twentyFourHoursAgo },
      isVerified: true,
      isWelcomeEmailSent: false,
    });

    for (const user of users) {
      await sendWelcomeEmail(user.email, user.fullname);
      await User.findByIdAndUpdate(user._id, { isWelcomeEmailSent: true });
    }
  } catch (error) {
    console.log(error);
  }
});
