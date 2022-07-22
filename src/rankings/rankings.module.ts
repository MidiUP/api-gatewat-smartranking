import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  controllers: [RankingsController],
  imports: [RabbitMqModule],
})
export class RankingsModule {}
