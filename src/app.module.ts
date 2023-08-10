import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PdfController } from './pdf/pdf.controller';
import { PdfService } from './pdf/pdf.service';
import { ExcelController } from './excel/excel.controller';
import { ExcelService } from './excel/excel.service';
import { PixelsController } from './pixels/pixels.controller';
import { PixelsService } from './pixels/pixels.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.BASE_URL),
  ],
  controllers: [PdfController, ExcelController, PixelsController],
  providers: [PdfService, ExcelService, PixelsService],
})
export class AppModule {}
