import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { env } from './modules/config';

async function bootstrap() {

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: env.RABBITMQ_URLS,
      queue: env.RABBITMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    }
  })

  // const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  // });
  
  // // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // const port = env.PORT;
  // await app.listen(port);

  await app.listen();
  
  // console.log(`🔐 User Service ejecutándose en puerto ${port}`);
  // console.log(`🗄️ Base de datos: ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`);
}

bootstrap();
