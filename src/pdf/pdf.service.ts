// pdf.service.ts
import * as fs from 'fs';
import * as path from 'path';

import * as PDFDocument from 'pdfkit';

export class PdfService {
  generatePdf(): fs.ReadStream {
    const pdfDoc = new PDFDocument();
    const outputPath = path.join(
      __dirname,
      '..',
      '..',
      'path',
      'to',
      'output.pdf',
    ); // Adjust the path
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    pdfDoc.pipe(fs.createWriteStream(outputPath));

    // Add content to the PDF
    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(24)
      .text('Ted-Talk', { align: 'center' });
    pdfDoc.moveDown(0.5); // Move cursor down

    // Add the body paragraphs

    pdfDoc
      .text('Invitation to Frontend Performance Tech Event', {
        align: 'center',
      })
      .fontSize(14);
    pdfDoc.moveDown(1); // Move cursor down

    pdfDoc.font('Helvetica').fontSize(12);
    pdfDoc.text(`Dear: Mr/ Miss,`);
    pdfDoc.moveDown(1); // Move cursor down

    pdfDoc.text(
      `We are excited to invite you to our upcoming tech event on Frontend Performance.`,
    );
    pdfDoc.text(`Date: August 20th, 2023`);
    pdfDoc.text(`Time: 10:00 AM - 4:00 PM`);
    pdfDoc.text(`Location: TechSpace Venue`);
    pdfDoc.text(`Address: KG123 Kigali Height, Kimihurura`);
    pdfDoc.moveDown(0.5); // Move cursor down
    pdfDoc.text(
      `Join us for a day of insightful discussions and presentations on optimizing frontend performance.`,
    );
    pdfDoc.text(
      `Learn about best practices, tools, and techniques to make your web applications faster and more efficient.`,
    );

    pdfDoc.moveDown(1); // Move cursor down

    pdfDoc.text('RSVP by August 15th, 2023:');
    pdfDoc.text('Email: kalisangabokevin@gmial.com');
    pdfDoc.text('Phone: (+250) 786-738-464');

    pdfDoc.moveDown(2); // Move cursor down

    pdfDoc.text('We look forward to your presence at the event!');
    pdfDoc.text('Sincerely,');
    pdfDoc.text('The TechSpace Team');

    pdfDoc.end();
    return fs.createReadStream(outputPath);
  }
}
