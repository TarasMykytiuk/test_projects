import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Build Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Nest Backend 1 API')
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints for user registration and login.')
    .build();
  // 2. Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);
  // 3. Mount Swagger UI (First argument is app, second is path without leading slash)
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
