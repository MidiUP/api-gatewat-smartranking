import { ClientProxyConnections } from '../rabbit-mq/client-proxy-connections';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private clientAdminBackend: ClientProxy;

  constructor(private readonly connectQueueAdmin: ClientProxyConnections) {
    this.clientAdminBackend = this.connectQueueAdmin.connectQueueAdmin();
  }

  async getCategoryById(id: string): Promise<Observable<any>> {
    return new Promise((resolve, reject) => {
      this.clientAdminBackend.send('get-category-by-id', id).subscribe({
        next: (category) => resolve(category),
        error: (error) => reject(error),
      });
    });
  }
}
