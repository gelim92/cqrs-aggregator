import { Document } from 'mongoose';

export interface ILineItem {
  id: number;
  productId: number;
  name: string;
  manufacturer: string;
  country: string;
  quantity: number;
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
