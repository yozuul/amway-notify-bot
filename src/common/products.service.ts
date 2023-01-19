import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {AddProductDto, Product} from './models';

@Injectable()
export class ProductsService {
   @InjectModel(Product)
   private productRepository: typeof Product

   async add(dto: AddProductDto) {
      return this.productRepository.create(dto)
   }
   async delete(id: number) {
      return this.productRepository.destroy({
         where: { id: id }
      })
   }
   async findAll() {
      return this.productRepository.findAll()
   }
   async checkExist(url) {
      return this.productRepository.findOne({
         where: { url: url }
      })
   }
}
