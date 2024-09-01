import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from './entities/Order.entity';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Injectable()
export class AggregatorService {
  constructor(@InjectModel('Order') private orderModel: Model<IOrder>) {}

  private buildConditions({
    manufacturer,
    country,
    name,
    status,
  }: {
    manufacturer?: string;
    country?: string;
    name?: string;
    status?: string;
  } = {}): any[] {
    const conditions = [];
    const fields = [
      { key: 'lineItems.manufacturer', value: manufacturer },
      { key: 'lineItems.country', value: country },
      { key: 'lineItems.name', value: name },
      { key: 'status', value: status },
    ];

    for (const field of fields) {
      if (field.value) {
        conditions.push({
          [field.key]: { $regex: new RegExp(`^${field.value}$`, 'i') },
        });
      }
    }

    return conditions;
  }

  getAllOrders(
    params: {
      manufacturer?: string;
      country?: string;
      name?: string;
      status?: string;
      sortBy?: string;
      sortDirection?: string;
    } = {},
  ): Promise<IOrder[]> {
    const conditions = this.buildConditions(params);
    const sortDirection = params.sortDirection || 'desc';
    let sortObject = {};
    if (params.sortBy) {
      sortObject = { [params.sortBy]: sortDirection === 'desc' ? -1 : 1 };
    }
    return this.orderModel
      .find(conditions.length > 0 ? { $and: conditions } : {})
      .sort(sortObject)
      .select('-_id -__v -lineItems._id');
  }

  getOrderById(orderId: number): Promise<IOrder> {
    return this.orderModel
      .findOne({ id: orderId })
      .select('-_id -__v -lineItems._id');
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
    return this.orderModel
      .findOneAndUpdate({ id: orderId }, updateOrderDto, {
        new: true,
      })
      .select('-_id -__v -lineItems._id');
  }
}
