import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

import { ParserModule } from './parser/parser.module';
import { CommonModule } from './common/common.module';
import { Channel, Product, User } from './common/models';
import { BotModule } from './bot/bot.module';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: '.env',
      }),
      SequelizeModule.forRoot({
         dialect: 'sqlite',
         storage: resolve('amway.db'),
         models: [User, Channel, Product],
         autoLoadModels: true,
         logging: false
      }),
      TelegrafModule.forRoot({
         middlewares: [sessions.middleware()],
         token: process.env.BOT_TOKEN,
      }),
      CommonModule, ParserModule, BotModule
   ],
   controllers: [],
   providers: [],
})
export class AppModule {}