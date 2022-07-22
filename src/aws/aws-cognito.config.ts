import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class AwsCognitoConfig {
  public userPoolId: string = process.env.USER_POOL_ID;
  public clientId: string = process.env.CLIENT_ID;
  public region: string = process.env.AWS_REGION_VIRGINIA;
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
