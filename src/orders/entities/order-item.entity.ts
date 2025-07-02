import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity';
import { Hamburger } from 'src/menu/entities/hamburger.entity';
import { Side } from 'src/menu/entities/side.entity';
import { Drink } from 'src/menu/entities/drink.entity';
import { Ingredient } from 'src/menu/entities/ingredient.entity';
import { Sauce } from 'src/menu/entities/sauce.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Hamburger, { eager: true })
  hamburger: Hamburger;

  @ManyToOne(() => Side, { eager: true })
  side: Side;

  @ManyToOne(() => Drink, { eager: true })
  drink: Drink;

  @ManyToMany(() => Ingredient, { eager: true })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => Sauce, { eager: true })
  @JoinTable()
  sauces: Sauce[];

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;
}
