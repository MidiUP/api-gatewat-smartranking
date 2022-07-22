import { AwsModule } from './../aws/aws.module';
import { CategoriesModule } from './../categories/categories.module';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [CategoriesModule, AwsModule, RabbitMqModule],
  exports: [PlayersService],
})
export class PlayersModule {}
