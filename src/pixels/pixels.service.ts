import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class PixelsService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly validImageContentTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
  ];

  constructor() {
    const connectionString = process.env.AZURE_BASE_URL;
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }
  async listImages(containerName: string): Promise<string[]> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }
    return blobs;
  }

  async uploadImage(
    containerName: string,
    fileName: string,
    fileContent: Buffer,
  ): Promise<void> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Get the file's content type
    const contentType = this.getFileContentType(fileName);

    // Check if the content type is valid for images
    if (!this.isValidImageContentType(contentType)) {
      throw new Error('Invalid image format');
    }

    await blockBlobClient.uploadData(fileContent, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    });
  }

  // Other methods...

  private getFileContentType(fileName: string): string {
    // Implement a logic to determine the content type based on the file extension
    // For example, you can use a library like `mime-types` or a custom mapping.
    // Here's a basic example for common image formats:
    if (fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')) {
      return 'image/jpeg';
    } else if (fileName.endsWith('.png')) {
      return 'image/png';
    } else if (fileName.endsWith('.gif')) {
      return 'image/gif';
    } else if (fileName.endsWith('.bmp')) {
      return 'image/bmp';
    } else {
      throw new Error('Unknown file format');
    }
  }

  private isValidImageContentType(contentType: string): boolean {
    return this.validImageContentTypes.includes(contentType);
  }
}
