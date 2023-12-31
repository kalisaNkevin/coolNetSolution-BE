import { Controller, Get, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('/v1/pdf')
@ApiTags('PDF generate')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully generated PDF',
  })
  @Get()
  async generatePdf(@Res() res: Response): Promise<void> {
    const pdfStream = this.pdfService.generatePdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    pdfStream.pipe(res);
  }
}
