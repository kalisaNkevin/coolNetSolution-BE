import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

export class ExcelService {
  async generateExcel(data: any): Promise<fs.ReadStream> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Event Participants');

    // Add headers to the worksheet
    worksheet.addRow(['Name', 'Email', 'Phone', 'RSVP Status']);

    // Add participant data rows
    data.participants.forEach((participant: any) => {
      worksheet.addRow([
        participant.name,
        participant.email,
        participant.phone,
        participant.rsvpStatus,
      ]);
    });

    const outputPath = path.join(
      __dirname,
      '..',
      '..',
      'path',
      'to',
      'output.xlsx',
    ); // Adjust the path to your desired location

    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('Output Directory Created:', outputDir);
    }

    // Write the workbook to a file
    await workbook.xlsx.writeFile(outputPath);

    // Create a readable stream from the file path
    const excelStream = fs.createReadStream(outputPath);

    return excelStream;
  }
}
