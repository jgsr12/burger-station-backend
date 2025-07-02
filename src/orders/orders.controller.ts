import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as User | undefined;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return {
      message: 'Orden creada',
      order: await this.ordersService.create(createOrderDto, user),
    };
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.ordersService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.ordersService.findOneById(id, user);
  }
}
