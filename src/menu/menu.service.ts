import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hamburger } from './entities/hamburger.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Sauce } from './entities/sauce.entity';
import { Side } from './entities/side.entity';
import { Drink } from './entities/drink.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Hamburger) private hamburgerRepo: Repository<Hamburger>,
    @InjectRepository(Ingredient) private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(Sauce) private sauceRepo: Repository<Sauce>,
    @InjectRepository(Side) private sideRepo: Repository<Side>,
    @InjectRepository(Drink) private drinkRepo: Repository<Drink>,
  ) {}

  getHamburgers() {
    return this.hamburgerRepo.find();
  }

  getIngredients() {
    return this.ingredientRepo.find();
  }

  getSauces() {
    return this.sauceRepo.find();
  }

  getSides() {
    return this.sideRepo.find();
  }

  getDrinks() {
    return this.drinkRepo.find();
  }
}
