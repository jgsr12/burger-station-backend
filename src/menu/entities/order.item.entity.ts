import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Hamburger } from "./hamburger.entity";
import { Ingredient } from "./ingredient.entity";
import { Sauce } from "./sauce.entity";
import { Side } from "./side.entity";
import { Drink } from "./drink.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Hamburger)
  hamburger: Hamburger;

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => Sauce)
  @JoinTable()
  sauces: Sauce[];

  @ManyToOne(() => Side)
  side: Side;

  @ManyToOne(() => Drink)
  drink: Drink;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;
}
