import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from './../categories/categories.service';
import { Injectable } from '@nestjs/common';
import { ClientProxyConnections } from 'src/rabbit-mq/client-proxy-connections';

@Injectable()
export class PlayersService {
  private clientAdminBackend: ClientProxy;
  constructor(
    private categoriesService: CategoriesService,
    private clientProxyConnections: ClientProxyConnections,
  ) {
    this.clientAdminBackend = this.clientProxyConnections.connectQueueAdmin();
  }

  async checkCategoryExists(idCategory: string): Promise<boolean> {
    return !!(await this.categoriesService.getCategoryById(idCategory));
  }

  async getPlayerById(id: string) {
    return await firstValueFrom(
      this.clientAdminBackend.send('get-player-by-id', id),
    );
  }
}
