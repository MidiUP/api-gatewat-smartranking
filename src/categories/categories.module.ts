import { Module } from '@nestjs/common';
import { ConnectQueueAdmin } from 'src/common/rabbitMq/connection';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [ConnectQueueAdmin, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
