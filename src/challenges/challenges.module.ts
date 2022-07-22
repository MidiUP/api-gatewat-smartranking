import { CategoriesModule } from './../categories/categories.module';
import { PlayersModule } from './../players/players.module';
import { Module } from '@nestjs/common';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  controllers: [ChallengesController],
  imports: [RabbitMqModule, PlayersModule, CategoriesModule],
  providers: [ChallengesService],
})
export class ChallengesModule {}
