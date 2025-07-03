import { DataSource } from 'typeorm';
import { Hamburger } from '../menu/entities/hamburger.entity';
import { Ingredient } from '../menu/entities/ingredient.entity';
import { Sauce } from '../menu/entities/sauce.entity';
import { Side } from '../menu/entities/side.entity';
import { Drink } from '../menu/entities/drink.entity';
import { config } from 'dotenv';

config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Hamburger, Ingredient, Sauce, Side, Drink],
  synchronize: true, // Solo para desarrollo
});

async function seed() {
  await dataSource.initialize();

  // Hamburguesas
  const hamburgers = [
    { name: 'La Montañesa', description: 'Carne de res artesanal, queso suizo, champiñones salteados, cebolla caramelizada y salsa de hierbas.', price: 9.5 },
    { name: 'El Ranchero', description: 'Pollo a la parrilla marinado, tocino crujiente, queso provolone, aros de cebolla fritos y salsa ranch.', price: 10.0 },
    { name: 'Veggie Mediterránea', description: 'Medallón de garbanzos y espinacas, queso feta, aceitunas negras, pimientos asados y tzatziki.', price: 8.75 },
    { name: 'Doble Búfalo', description: 'Doble carne de res, queso cheddar añejo, pepinillos encurtidos, cebolla roja y salsa búfalo picante.', price: 11.75 },
    { name: 'Mar y Tierra', description: 'Carne de res, camarones salteados al ajillo, aguacate y salsa rosada de la casa.', price: 13.0 },
  ];
  await dataSource.getRepository(Hamburger).save(hamburgers);

  // Ingredientes extra
  const ingredients = [
    { name: 'Huevo frito', price: 1.0 },
    { name: 'Jalapeños', price: 0.5 },
    { name: 'Guacamole', price: 1.5 },
    { name: 'Piña caramelizada', price: 0.75 },
    { name: 'Extra queso', price: 0.8 },
  ];
  await dataSource.getRepository(Ingredient).save(ingredients);

  // Salsas
  const sauces = [
    { name: 'Kétchup', price: 0 },
    { name: 'Mayonesa', price: 0 },
    { name: 'Mostaza Dijón', price: 0 },
    { name: 'Salsa BBQ ahumada', price: 0.6 },
    { name: 'Mayonesa picante', price: 0.6 },
  ];
  await dataSource.getRepository(Sauce).save(sauces);

  // Acompañamientos
  const sides = [
    { name: 'Papas Fritas Corte Casero', price: 2.75 },
    { name: 'Papas en Cascos con Piel', price: 3.25 },
    { name: 'Batatas Fritas', price: 3.5 },
  ];
  await dataSource.getRepository(Side).save(sides);

  // Bebidas
  const drinks = [
    { name: 'Limonada Natural', type: 'Limonada', price: 2.25 },
    { name: 'Gaseosa Cola', type: 'Gaseosa', price: 2.0 },
    { name: 'Gaseosa Naranja', type: 'Gaseosa', price: 2.0 },
    { name: 'Gaseosa Lima-Limón', type: 'Gaseosa', price: 2.0 },
    { name: 'Té Helado Durazno', type: 'Té Helado', price: 2.0 },
    { name: 'Té Helado Limón', type: 'Té Helado', price: 2.0 },
    { name: 'Agua Embotellada', type: 'Agua', price: 1.5 },
    { name: 'Cerveza Artesanal', type: 'Cerveza', price: 4.0 },
  ];
  await dataSource.getRepository(Drink).save(drinks);

  console.log('✅ ¡Base de datos poblada exitosamente!');
  await dataSource.destroy();
}

seed();
