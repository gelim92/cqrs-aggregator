import { Document } from 'mongoose';

export interface ILineItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  manufacturer: string;
  country: string;
  unitPrice: number;
  total: number;
}

export interface IOrder extends Document {
  id: number;
  lineItems: ILineItem[];
  netTotal: number;
  status: string;
  createdOn: Date;
  modifiedOn: Date;
}
