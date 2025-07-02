import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://burger-station-frontend-ten.vercel.app',
    credentials: true,
  });

  app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Burger Station API')
    .setDescription('Documentación de autenticación y gestión de usuarios')
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4400;
  await app.listen(port);

  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📘 Swagger disponible en http://localhost:${port}/api`);
}

bootstrap();
