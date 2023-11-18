import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
