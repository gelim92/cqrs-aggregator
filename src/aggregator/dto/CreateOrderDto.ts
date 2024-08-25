import { ILineItem } from '../entities/Order.entity';

export class CreateOrderDto {
  id: number;
  lineItems: ILineItem[];
  status: string;
  netTotal: number;
}
