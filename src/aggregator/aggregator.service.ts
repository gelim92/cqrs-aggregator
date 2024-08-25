import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from './entities/Order.entity';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Injectable()
export class AggregatorService {
  constructor(@InjectModel('Order') private orderModel: Model<IOrder>) {}

  getAllOrders(): Promise<IOrder[]> {
    return this.orderModel.find();
  }

  getOrderById(orderId: number): Promise<IOrder> {
    return this.orderModel.findOne({ id: orderId });
  }

  createOrder(order: CreateOrderDto): Promise<IOrder> {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async deleteOrder(orderId: number) {
    await this.orderModel.deleteOne({ id: orderId });
  }

  async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<IOrder> {
    return this.orderModel.findOneAndUpdate({ id: orderId }, updateOrderDto, {
      new: true,
    });
  }
}
