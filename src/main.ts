import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

      app.enableCors({
      origin: ['http://localhost:5051', 'http://127.0.0.1:5051'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
   console.log(`La aplicación está escuchando en: ${await app.getUrl()}`);
}
bootstrap();
