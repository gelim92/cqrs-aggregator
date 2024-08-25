import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from './entities/Order.entity';

@Injectable()
export class AggregatorService {
  constructor(@InjectModel('Order') private orderModel: Model<IOrder>) {}

  getAllOrders(): Promise<IOrder[]> {
    return this.orderModel.find();
  }

  createOrder(order: IOrder): Promise<IOrder> {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }
}
