import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePDF = ({ bookingId, userEmail, seats = [] }) => {
  return new Promise((resolve, reject) => {
    try {
      // 📁 create tickets folder if not exists
      const ticketsDir = path.join(process.cwd(), "tickets");
      fs.mkdirSync(ticketsDir, { recursive: true });

      const filePath = path.join(
        ticketsDir,
        `ticket-${bookingId}.pdf`
      );

      // 📄 create pdf
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ===============================
         HEADER
      =============================== */
      doc
        .fontSize(24)
        .text("🎟️ FilmKart Movie Ticket", {
          align: "center",
        });

      doc.moveDown();

      /* ===============================
         BOOKING DETAILS
      =============================== */
      doc
        .fontSize(14)
        .text(`Booking ID : ${bookingId}`)
        .text(`Customer   : ${userEmail}`)
        .text(`Status     : CONFIRMED ✅`);

      doc.moveDown(1.5);

      /* ===============================
         SEATS SECTION
      =============================== */
      doc
        .fontSize(16)
        .text("Booked Seats", {
          underline: true,
        });

      doc.moveDown(0.5);

      // ✅ SAFE CHECK (prevents crash)
      if (!Array.isArray(seats) || seats.length === 0) {
        doc
          .fontSize(14)
          .text("Seat information not available");
      } else {
        seats.forEach((seat, index) => {
          doc
            .fontSize(14)
            .text(`🎫 Seat ${index + 1}: ${seat}`);
        });
      }

      doc.moveDown(2);

      /* ===============================
         FOOTER
      =============================== */
      doc
        .fontSize(14)
        .text("Enjoy your movie! 🍿", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(10)
        .fillColor("gray")
        .text(
          "This is a system generated ticket. Please carry valid ID proof.",
          { align: "center" }
        );

      // finish document
      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};