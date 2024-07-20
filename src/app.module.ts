import { Module } from '@nestjs/common';

import { ProductsModule } from './modules/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterModule } from './modules/register/register.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Env } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Env, true>) => ({
        transport: {
          host: configService.get('EMAIL_HOST', { infer: true }),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER_NAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    RegisterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
