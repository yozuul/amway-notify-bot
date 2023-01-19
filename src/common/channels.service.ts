import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Channel } from './models';

@Injectable()
export class ChannelService {
   constructor(
      @InjectModel(Channel)
      private channelRepository: typeof Channel
   ) {}

   async addNew(channelId) {
      const existChannel = await this.channelRepository.findOne({
         where: { channelId: channelId }
      })
      if(!existChannel) {
         return this.channelRepository.create({ channelId })
      }
      return existChannel
   }
   async findAll() {
      return this.channelRepository.findAll({
         attributes: ['channelId']
      })
   }
}
