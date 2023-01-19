import { Controller, UnauthorizedException, Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
   constructor(
      private readonly parserService: ParserService
   ) {}

   @Post('check')
   async checkProducts(@Body() body: any, @Req() req: any) {
      // console.log(req.headers.key)
      if(req.headers.key && req.headers.key === process.env.SECRET) {
         this.parserService.checkProducts()
      } else {
         throw new UnauthorizedException()
      }
   }
}

