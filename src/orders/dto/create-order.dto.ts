import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsInt()
  hamburgerId: number;

  @IsArray()
  ingredientIds: number[];

  @IsArray()
  sauceIds: number[];

  @IsInt()
  sideId: number;

  @IsInt()
  drinkId: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
