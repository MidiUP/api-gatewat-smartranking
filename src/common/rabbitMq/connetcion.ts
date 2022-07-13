import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export const connectRabbitMq = (fila: string): ClientProxy => {
  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:i1k7st2vIWk9@44.204.159.57:5672/smartranking'],
      queue: fila,
    },
  });
};

@Injectable()
export class ConnectQueueAdmin {
  public connect(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:i1k7st2vIWk9@44.204.159.57:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }
}
