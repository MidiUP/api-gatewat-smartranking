import { JwtStrategy } from './jwt.strategy';
import { AwsModule } from './../aws/aws.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [AwsModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
})
export class AuthModule {}
