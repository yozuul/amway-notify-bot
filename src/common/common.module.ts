import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User, Product, Channel } from './models';
import { UsersService } from './users.service';
import { ChannelService } from './channels.service';
import { ProductsService } from './products.service';

@Module({
   imports: [
      SequelizeModule.forFeature([User, Product, Channel])
   ],
   providers: [UsersService, ChannelService, ProductsService],
   exports: [
      UsersService, ChannelService, ProductsService
   ]
})
export class CommonModule {}
