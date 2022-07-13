import { CategoriesModule } from './../categories/categories.module';
import { ConnectQueueAdmin } from '../common/rabbitMq/connection';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [ConnectQueueAdmin, PlayersService],
  imports: [CategoriesModule],
})
export class PlayersModule {}
