import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { Hamburger } from 'src/menu/entities/hamburger.entity';
import { Side } from 'src/menu/entities/side.entity';
import { Drink } from 'src/menu/entities/drink.entity';
import { Ingredient } from 'src/menu/entities/ingredient.entity';
import { Sauce } from 'src/menu/entities/sauce.entity';
import { MailerService } from 'src/common/services/mailer.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Hamburger) private burgerRepo: Repository<Hamburger>,
    @InjectRepository(Side) private sideRepo: Repository<Side>,
    @InjectRepository(Drink) private drinkRepo: Repository<Drink>,
    @InjectRepository(Ingredient) private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(Sauce) private sauceRepo: Repository<Sauce>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    return await this.orderRepo.manager.transaction(async (manager) => {
      let orderTotal = 0;
      const processedItems: any[] = [];

      for (const item of createOrderDto.items) {
        const hamburger = await manager.findOneBy(Hamburger, { id: item.hamburgerId });
        if (!hamburger) throw new NotFoundException(`Hamburguesa con ID ${item.hamburgerId} no encontrada`);

        const side = item.sideId ? await manager.findOneBy(Side, { id: item.sideId }) : null;
        const drink = item.drinkId ? await manager.findOneBy(Drink, { id: item.drinkId }) : null;

        const ingredients = item.ingredientIds?.length
          ? await manager.find(Ingredient, { where: item.ingredientIds.map(id => ({ id })) })
          : [];

        const sauces = item.sauceIds?.length
          ? await manager.find(Sauce, { where: item.sauceIds.map(id => ({ id })) })
          : [];

        let itemPrice = parseFloat(hamburger.price.toString()) +
                        (side ? parseFloat(side.price.toString()) : 0) +
                        (drink ? parseFloat(drink.price.toString()) : 0) +
                        ingredients.reduce((sum, i) => sum + parseFloat(i.price.toString()), 0) +
                        sauces.reduce((sum, s) => sum + parseFloat(s.price.toString()), 0);

        processedItems.push({ hamburger, side, drink, ingredients, sauces, price: itemPrice });
        orderTotal += itemPrice;
      }

      const order = await manager.save(manager.create(Order, {
        user: { id: user.id },
        total: orderTotal,
      }));

      for (const item of processedItems) {
        await manager.save(manager.create(OrderItem, {
          order: { id: order.id },
          hamburger: item.hamburger,
          side: item.side || null,
          drink: item.drink || null,
          ingredients: item.ingredients,
          sauces: item.sauces,
          price: item.price,
        }));
      }

      const fullOrder = await manager.findOne(Order, {
        where: { id: order.id },
        relations: [
          'user',
          'items',
          'items.hamburger',
          'items.side',
          'items.drink',
          'items.ingredients',
          'items.sauces',
        ],
      });

      if (!fullOrder) throw new NotFoundException('Orden no encontrada');

      // Enviar correo
      const html = this.generateOrderHtml(fullOrder);
      await this.mailerService.sendOrderConfirmation(
        fullOrder.user.email,
        'Confirmación de tu pedido en The Burger Station',
        html,
      );

      return fullOrder;
    });
  }

  async findAllByUser(user: User): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.hamburger', 'items.side', 'items.drink', 'items.ingredients', 'items.sauces'],
    });
  }

  async findOneById(id: number, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['items', 'items.hamburger', 'items.side', 'items.drink', 'items.ingredients', 'items.sauces'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  private generateOrderHtml(order: Order): string {
    const itemsHtml = order.items.map(item => {
      const ingredients = item.ingredients.length > 0
        ? item.ingredients.map(i => `${i.name} ($${Number(i.price).toFixed(2)})`).join(', ')
        : 'Ninguno';

      const sauces = item.sauces.length > 0
        ? item.sauces.map(s => `${s.name} ($${Number(s.price).toFixed(2)})`).join(', ')
        : 'Ninguna';

      return `
        <li>
          <strong>${item.hamburger?.name}</strong> - $${Number(item.hamburger?.price).toFixed(2)}<br/>
          ${item.hamburger?.description}<br/>
          Acompañamiento: ${item.side?.name || 'Ninguno'}<br/>
          Bebida: ${item.drink?.name || 'Ninguna'}<br/>
          Ingredientes adicionales: ${ingredients}<br/>
          Salsas: ${sauces}<br/>
          <strong>Total item:</strong> $${Number(item.price).toFixed(2)}
        </li>
      `;
    }).join('');

    return `
      <h2>Gracias por tu pedido, ${order.user.first_name}!</h2>
      <p>Resumen de tu orden #${order.id}:</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total del pedido:</strong> $${Number(order.total).toFixed(2)}</p>
      <p>Fecha: ${new Date(order.createdAt).toLocaleString()}</p>
    `;
  }
}
