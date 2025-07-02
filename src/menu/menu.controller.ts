import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('hamburgers')
  getHamburgers() {
    return this.menuService.getHamburgers();
  }

  @Get('ingredients')
  getIngredients() {
    return this.menuService.getIngredients();
  }

  @Get('sauces')
  getSauces() {
    return this.menuService.getSauces();
  }

  @Get('sides')
  getSides() {
    return this.menuService.getSides();
  }

  @Get('drinks')
  getDrinks() {
    return this.menuService.getDrinks();
  }
}
