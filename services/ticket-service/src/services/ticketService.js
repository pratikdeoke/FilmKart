import { generatePDF } from "../utils/pdfGenerator.js";
import { sendTicketEmail } from "./emailService.js";

export const handleTicketGeneration = async (data) => {
  const { bookingId, userEmail, seats } = data;

  console.log("🎟️ Generating ticket for:", bookingId);

  // Generate PDF
  const filePath = await generatePDF({
    bookingId,
    userEmail,
    seats,
  });

  // Send Email
  await sendTicketEmail({
    userEmail,
    bookingId,
    filePath,
  });

  console.log("✅ Ticket sent successfully");
};