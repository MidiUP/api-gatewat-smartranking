import { CategoriesService } from './../categories/categories.service';
import { ConnectQueueAdmin } from './../common/rabbitMq/connetcion';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [ConnectQueueAdmin, PlayersService, CategoriesService],
})
export class PlayersModule {}
