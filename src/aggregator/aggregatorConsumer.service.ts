import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { AggregatorService } from './aggregator.service';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { UpdateOrderAggregateStatusDto } from './dto/UpdateOrderAggregateStatusDto';

interface OrderQueueMessage {
  operationType: 'CREATE' | 'UPDATE';
  payload: string;
}

@Injectable()
export class AggregatorConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private queueName: string;

  constructor(
    private readonly configService: ConfigService,
    private aggregatorService: AggregatorService,
  ) {
    const queueUrl = configService.get<string>('cqrsQueueUrl');
    this.queueName = configService.get<string>('cqrsOrderQueueName');
    const connection = amqp.connect([queueUrl]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queueName, { durable: true });
        await channel.consume(this.queueName, async (message) => {
          if (message) {
            const messageContent: OrderQueueMessage = JSON.parse(
              message.content.toString(),
            );
            Logger.log('Received message:', messageContent);
            await this.processMessage(messageContent);
            channel.ack(message);
          }
        });
      });
      Logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      Logger.error('Error starting the consumer:', err);
    }
  }

  async processMessage(messageContent: OrderQueueMessage) {
    switch (messageContent.operationType) {
      case 'CREATE':
        const order: CreateOrderDto = JSON.parse(messageContent.payload);
        await this.aggregatorService.createOrder(order);
        break;
      case 'UPDATE':
        const updateOrder: UpdateOrderAggregateStatusDto = JSON.parse(
          messageContent.payload,
        );
        await this.aggregatorService.updateOrder(updateOrder.orderId, {
          status: updateOrder.status,
        });
        break;
    }
  }
}
