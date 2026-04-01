import nodemailer from "nodemailer";
import path from "path";

export const sendTicketEmail = async ({
  bookingId,
  userEmail,
  filePath,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FilmKart 🎬" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your Ticket Confirmation 🎟️",
    text: `Booking Confirmed! ID: ${bookingId}`,
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath,
      },
    ],
  });

  console.log("📧 Email sent successfully");
};