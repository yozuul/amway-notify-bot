import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User, AddUserDto } from './models';

@Injectable()
export class UsersService {
   constructor(
      @InjectModel(User)
      private userRepository: typeof User
   ) {}

   async addNew(dto: AddUserDto) {
      return this.userRepository.create(dto)
   }
   async findById(tgId) {
      return this.userRepository.findOne({
         where: { tgId: tgId }
      })
   }
   async findAll() {
      return this.userRepository.findAll()
   }
}
