import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  setupSwagger(app);
  await app.listen(port);

  Logger.log(`Application running on port ${port}`);
}
bootstrap();
