import { firstValueFrom } from 'rxjs';
import { ClientProxyConnections } from 'src/rabbit-mq/client-proxy-connections';
import { ClientProxy } from '@nestjs/microservices';
import { CategoriesService } from './../categories/categories.service';
import { PlayersService } from './../players/players.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChallengesService {
  private readonly clientChallengeBackend: ClientProxy;
  constructor(
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    private readonly clientProxyConnections: ClientProxyConnections,
  ) {
    this.clientChallengeBackend =
      this.clientProxyConnections.connectQueueChallenge();
  }

  async checkPlayersExists(players: string[]): Promise<boolean> {
    for (const player of players) {
      if ((await this.playersService.getPlayerById(player)) === null) {
        return false;
      }
    }
    return true;
  }

  async checkAllCategoriesCorrect(
    idPlayers: string[],
    idCategory: string,
  ): Promise<Error> {
    const category = await this.categoriesService.getCategoryById(idCategory);

    if (!category) {
      return new BadRequestException(
        `this category ${idCategory} is not registered`,
      );
    }

    for (const idPlayer of idPlayers) {
      const player = await this.playersService.getPlayerById(idPlayer);
      if (player.category._id !== idCategory) {
        return new BadRequestException(
          `this player ${idPlayer} belongs to other category`,
        );
      }
    }

    return null;
  }

  async getChallengeById(id: string) {
    return await firstValueFrom(
      this.clientChallengeBackend.send('get-challenge-by-id', id),
    );
  }
}
