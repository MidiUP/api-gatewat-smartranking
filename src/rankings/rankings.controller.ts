import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ClientProxyConnections } from 'src/rabbit-mq/client-proxy-connections';
import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Controller('api/v1/rankings')
export class RankingsController {
  private readonly logger = new Logger(RankingsController.name);
  private readonly clientRankingBackend: ClientProxy;

  constructor(private readonly clientProxyConnections: ClientProxyConnections) {
    this.clientRankingBackend =
      this.clientProxyConnections.connectQueueRanking();
  }

  @Get()
  async getRankings(
    @Query('idCategory') idCategory: string,
    @Query('dataRef') dataRef: string,
  ): Promise<any> {
    if (!idCategory) {
      throw new BadRequestException('The idCategory cannot be null');
    }
    return await firstValueFrom(
      this.clientRankingBackend.send('get-ranking-by-category', {
        idCategory,
        dataRef,
      }),
    );
  }
}
