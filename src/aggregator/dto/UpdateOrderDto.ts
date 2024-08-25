import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './CreateOrderDto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
