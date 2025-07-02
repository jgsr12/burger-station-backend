import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Drink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;
}
