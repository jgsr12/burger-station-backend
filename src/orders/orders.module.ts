import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Hamburger } from 'src/menu/entities/hamburger.entity';
import { Side } from 'src/menu/entities/side.entity';
import { Drink } from 'src/menu/entities/drink.entity';
import { Ingredient } from 'src/menu/entities/ingredient.entity';
import { Sauce } from 'src/menu/entities/sauce.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerModule } from 'src/common/services/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Hamburger,
      Side,
      Drink,
      Ingredient,
      Sauce,
      User,
    ]),
    MailerModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
