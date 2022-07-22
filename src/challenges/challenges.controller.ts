import { AttributeMatchChallengeDto } from './dtos/attribute-match-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ClientProxyConnections } from '../rabbit-mq/client-proxy-connections';
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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Controller('api/v1/challenges')
export class ChallengesController {
  private logger = new Logger(ChallengesController.name);
  private clientAdminBackend: ClientProxy;
  private clientChallengeBackend: ClientProxy;
  constructor(
    private clientProxyConnections: ClientProxyConnections,
    private challengesService: ChallengesService,
  ) {
    this.clientAdminBackend = clientProxyConnections.connectQueueAdmin();
    this.clientChallengeBackend =
      clientProxyConnections.connectQueueChallenge();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    const { players, category, requester } = createChallengeDto;
    const existsAllPlayers = await this.challengesService.checkPlayersExists(
      players,
    );
    if (!existsAllPlayers) {
      throw new BadRequestException('anyone of the players is not registered');
    }

    const errorCategoryPlayer =
      await this.challengesService.checkAllCategoriesCorrect(players, category);

    if (errorCategoryPlayer) {
      throw errorCategoryPlayer;
    }

    const requesterIsPLayer = players.find((player) => player === requester);

    if (!requesterIsPLayer) {
      throw new BadRequestException('requester need be a player of challenge');
    }

    this.clientChallengeBackend.emit('create-challenge', createChallengeDto);
  }

  @Get()
  async getChallenges(@Query('idPlayer') idPlayer: string) {
    if (idPlayer) {
      const player = await this.challengesService.checkPlayersExists([
        idPlayer,
      ]);
      if (!player) {
        throw new BadRequestException(`this player is not registered`);
      }
      return this.clientChallengeBackend.send(
        'get-challenges-by-player',
        idPlayer,
      );
    }
    return this.clientChallengeBackend.send('get-challenges', '');
  }

  @Get(':id')
  async getChallengeById(@Param('id') id: string) {
    return this.clientChallengeBackend.send('get-challenge-by-id', id);
  }

  @Put(':_id')
  async updateChallenge(
    @Param('_id') _id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    const challenge = await this.challengesService.getChallengeById(_id);
    if (!challenge) {
      throw new BadRequestException('this challenge is not registered');
    }

    if (challenge.status !== ChallengeStatus.PENDING) {
      return new BadRequestException('this challenge cannot be updated');
    }

    this.clientChallengeBackend.emit('update-challenge', {
      id: _id,
      challenge: updateChallengeDto,
    });
  }

  @Delete(':_id')
  async deleteChallenge(@Param('_id') _id: string) {
    const challenge = await this.challengesService.getChallengeById(_id);
    if (!challenge) {
      throw new BadRequestException('this challenge is not registered');
    }

    this.clientChallengeBackend.emit('delete-challenge', _id);
  }

  @Post('addMatchChallenge/:_id')
  async attributeMatchChallenge(
    @Param('_id') _id: string,
    @Body() attributeMatchChallengeDto: AttributeMatchChallengeDto,
  ) {
    const challenge = await this.challengesService.getChallengeById(_id);
    if (!challenge) {
      throw new BadRequestException('this challenge is not registered');
    }

    if (challenge.status === ChallengeStatus.COMPLETED) {
      throw new BadRequestException('this challenge are completed');
    }

    if (challenge.status !== ChallengeStatus.ACCEPT) {
      throw new BadRequestException('this challenge are not accepted yet');
    }

    const playerWinnerExists = challenge.players.find(
      (player) => player === attributeMatchChallengeDto.def,
    );

    if (!playerWinnerExists) {
      throw new BadRequestException(
        'the player winner is not in this challenge',
      );
    }

    const match = {
      category: challenge.category,
      def: attributeMatchChallengeDto.def,
      challenge: challenge._id,
      players: challenge.players,
      result: attributeMatchChallengeDto.result,
    };

    this.clientChallengeBackend.emit('create-match', match);
  }
}
