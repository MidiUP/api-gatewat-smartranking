import { AwsCognitoConfig } from './aws-cognito.config';
import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Service } from './aws-S3.service';

@Module({
  providers: [AwsS3Service, AwsCognitoService, AwsCognitoConfig],
  exports: [AwsS3Service, AwsCognitoService, AwsCognitoConfig],
})
export class AwsModule {}
