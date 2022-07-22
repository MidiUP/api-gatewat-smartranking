import { ClientProxyConnections } from '../rabbit-mq/client-proxy-connections';
import { Observable } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  private clientAdminBackend: ClientProxy;

  constructor(private readonly connectQueueAdmin: ClientProxyConnections) {
    this.clientAdminBackend = this.connectQueueAdmin.connectQueueAdmin();
  }

  @Post('')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('')
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: createCategoryDto,
    });
  }
}
