import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ExcelService } from './excel.service';

@ApiTags('EXCEL')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @ApiResponse({ status: 200, description: 'Successfully generated EXCEL' })
  @Get()
  async generateExcel(@Res() res: Response): Promise<void> {
    const data = {
      participants: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          rsvpStatus: 'Attending',
        },
        // ... other participants
      ],
    };

    const excelStream = await this.excelService.generateExcel(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

    excelStream.pipe(res);
  }
}
