import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);

  public async uploadFile(file: any, id: string) {
    try {
      const s3 = new AWS.S3({
        region: process.env.AWS_REGION_VIRGINIA,
      });
      const fileExtension = file.originalname.split('.')[1];
      const urlKey = `${id}.${fileExtension}`;

      const params = {
        Body: file.buffer,
        Bucket: process.env.NAME_BUCKET,
        Key: urlKey,
      };

      return (await s3.upload(params).promise()).Location;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
