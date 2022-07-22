import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CategoriesModule,
    PlayersModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChallengesModule,
    RabbitMqModule,
    RankingsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
