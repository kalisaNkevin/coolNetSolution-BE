import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PixelsService } from './pixels.service';
import { Express } from 'express';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('/v1/upload')
@ApiTags('Upload Image')
export class PixelsController {
  constructor(private readonly pixelsService: PixelsService) {}

  @ApiResponse({
    status: 201,
    description: 'Image uploaded and saved to Azure Blob Storage successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Unsupported file format',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadImageAndSaveToAzure(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!this.isSupportedFileFormat(file.originalname)) {
        throw new BadRequestException('Unsupported file format');
      }

      const containerName = process.env.NAME_BASE_URL;
      const fileName = file.originalname;

      await this.pixelsService.uploadImage(
        containerName,
        fileName,
        file.buffer,
      );

      return {
        message: 'Image uploaded and saved to Azure Blob Storage successfully',
      };
    } catch (error) {
      throw new BadRequestException('Unsupported file format');
    }
  }
  @Get('/list')
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 200,
    description: 'List of image filenames retrieved successfully',
  })
  async listImages() {
    const containerName = process.env.NAME_BASE_URL;
    const blobs = await this.pixelsService.listImages(containerName);

    return {
      images: blobs,
    };
  }
  // ... Other methods

  private isSupportedFileFormat(filename: string): boolean {
    const supportedFormats = ['.jpg', '.jpeg', '.png'];
    const fileExtension = filename
      .toLowerCase()
      .slice(filename.lastIndexOf('.'));
    return supportedFormats.includes(fileExtension);
  }
}
