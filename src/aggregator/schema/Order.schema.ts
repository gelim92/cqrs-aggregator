import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';

@Schema()
export class LineItem {
  @Prop()
  id: number;

  @Prop()
  productId: number;

  @Prop()
  quantity: number;

  @Prop()
  name: string;

  @Prop()
  manufacturer: string;

  @Prop()
  country: string;

  @Prop()
  unitPrice: number;

  @Prop()
  total: number;
}

export const LineItemSchema = SchemaFactory.createForClass(LineItem);

@Schema({ timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' } })
export class Order {
  @Prop()
  id: number;

  @Prop([LineItem])
  lineItems: Type<LineItem>[];

  @Prop()
  netTotal: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
