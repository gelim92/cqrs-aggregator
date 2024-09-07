import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/Order.schema';
import { AggregatorConsumerService } from './aggregatorConsumer.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://myusername:mypassword@localhost:27017', {
      dbName: 'cqrs',
    }),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [AggregatorController],
  providers: [AggregatorService, AggregatorConsumerService],
})
export class AggregatorModule {}
