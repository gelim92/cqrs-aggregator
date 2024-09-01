import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { Response } from 'express';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Get('orders')
  async getOrders(
    @Res() response,
    @Query('manufacturer') manufacturer?: string,
    @Query('country') country?: string,
    @Query('name') name?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: string,
  ) {
    try {
      const orders = await this.aggregatorService.getAllOrders({
        manufacturer,
        country,
        name,
        sortDirection,
        sortBy,
      });
      return response.status(HttpStatus.OK).json(orders);
    } catch (err) {
      return response.json(err.response);
    }
  }

  @Get('orders/:id')
  async getOrderById(@Res() response: Response, @Param('id') orderId: string) {
    try {
      const order = await this.aggregatorService.getOrderById(+orderId);
      return response.status(HttpStatus.OK).json(order);
    } catch (err) {
      return response.json(err.response);
    }
  }

  @Post('orders')
  async createOrder(@Res() response: Response, @Body() order: CreateOrderDto) {
    try {
      const newOrder = await this.aggregatorService.createOrder(order);
      return response.status(HttpStatus.CREATED).json(newOrder);
    } catch (err) {
      return response.json(err.response);
    }
  }

  @Put('orders/:id')
  async updateOrder(
    @Res() response: Response,
    @Param('id') orderId: string,
    @Body() order: UpdateOrderDto,
  ) {
    try {
      const updatedOrder = await this.aggregatorService.updateOrder(
        +orderId,
        order,
      );
      return response.status(HttpStatus.OK).json(updatedOrder);
    } catch (err) {
      return response.json(err.response);
    }
  }

  @Delete('orders/:id')
  async deleteOrder(@Res() response: Response, @Param('id') orderId: string) {
    try {
      await this.aggregatorService.deleteOrder(+orderId);
      return response.status(HttpStatus.OK).send();
    } catch (err) {
      return response.json(err.response);
    }
  }
}
