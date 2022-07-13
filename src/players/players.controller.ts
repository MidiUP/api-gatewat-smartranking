import { Observable } from 'rxjs';
import { PlayersService } from './players.service';
import { ConnectQueueAdmin } from './../common/rabbitMq/connetcion';
import { ClientProxy } from '@nestjs/microservices';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  private clientAdminBackend: ClientProxy;

  constructor(
    private readonly connectQueueAdmin: ConnectQueueAdmin,
    private readonly playersService: PlayersService,
  ) {
    this.clientAdminBackend = this.connectQueueAdmin.connect();
  }

  @Post('')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createPlayerDto: CreatePlayerDto) {
    const existsCategory = await this.playersService.checkCategoryExists(
      createPlayerDto.idCategory,
    );
    if (existsCategory) {
      this.clientAdminBackend.emit('create-player', createPlayerDto);
      return;
    } else {
      throw new BadRequestException('the idCategory passed is not exists');
    }
  }

  @Get('')
  getPlayers(): Observable<any> {
    return this.clientAdminBackend.send('get-players', '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('_id') _id: string,
  ) {
    const existsCategory = await this.playersService.checkCategoryExists(
      createPlayerDto.idCategory,
    );
    if (existsCategory) {
      this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: createPlayerDto,
      });
      return;
    } else {
      throw new BadRequestException('the idCategory passed is not exists');
    }
  }

  @Delete(':_id')
  async deletePlayer(@Param('_id') _id: string) {
    this.clientAdminBackend.emit('delete-player', _id);
  }
}
