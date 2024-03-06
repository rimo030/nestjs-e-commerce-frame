import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './configs/swagger.config';
import { HttpExceptionFilter } from './exceptions/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);
  await app.listen(port);

  Logger.log(`Application running on port ${port}`);
}
bootstrap();
