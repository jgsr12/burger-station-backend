import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hamburger } from './entities/hamburger.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Sauce } from './entities/sauce.entity';
import { Side } from './entities/side.entity';
import { Drink } from './entities/drink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hamburger, Ingredient, Sauce, Side, Drink])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
