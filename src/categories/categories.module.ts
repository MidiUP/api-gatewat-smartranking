import { Module } from '@nestjs/common';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
  imports: [RabbitMqModule],
})
export class CategoriesModule {}
