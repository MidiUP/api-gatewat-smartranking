import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthSignInUserDto } from './dtos/auth-sigin-user.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() authSignInUserDto: AuthSignInUserDto) {
    return await this.awsCognitoService.registerUser(authSignInUserDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.awsCognitoService.authenticationUser(authLoginUserDto);
  }
}
