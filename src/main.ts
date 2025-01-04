import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuration de la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non décorées
    transform: true, // Transforme automatiquement les types
    forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non autorisées
  }));

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('The Library API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Démarrage du serveur
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
