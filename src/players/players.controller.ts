import { AwsS3Service } from './../aws/aws-S3.service';
import { firstValueFrom, Observable } from 'rxjs';
import { PlayersService } from './players.service';
import { ClientProxyConnections } from '../rabbit-mq/client-proxy-connections';
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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  private clientAdminBackend: ClientProxy;

  constructor(
    private readonly connectQueueAdmin: ClientProxyConnections,
    private readonly playersService: PlayersService,
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.clientAdminBackend = this.connectQueueAdmin.connectQueueAdmin();
  }

  @Post('')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createPlayerDto: CreatePlayerDto) {
    const existsCategory = await this.playersService.checkCategoryExists(
      createPlayerDto.category,
    );
    if (existsCategory) {
      this.clientAdminBackend.emit('create-player', createPlayerDto);
      return;
    } else {
      throw new BadRequestException('the idCategory passed is not exists');
    }
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  getPlayers(@Req() req: Request): Observable<any> {
    this.logger.log(`REQUEST: ${JSON.stringify(req.user)}`);
    return this.clientAdminBackend.send('get-players', '');
  }

  @Get(':id')
  getPlayerById(@Param('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-player-by-id', id);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('_id') _id: string,
  ) {
    const existsCategory = await this.playersService.checkCategoryExists(
      createPlayerDto.category,
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

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Param('id') id: string) {
    const player = await firstValueFrom(
      this.clientAdminBackend.send('get-player-by-id', id),
    );

    if (!player) {
      throw new BadRequestException('player not found');
    }

    const urlImageS3 = await this.awsS3Service.uploadFile(file, id);
    const playerUpdated: CreatePlayerDto = {
      ...player,
      urlImagePlayer: urlImageS3,
    };

    this.clientAdminBackend.emit('update-player', { ...playerUpdated, id });
  }
}
