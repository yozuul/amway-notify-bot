import { Module } from '@nestjs/common';

import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { CommonModule } from 'src/common/common.module';

@Module({
   controllers: [ParserController],
   providers: [ParserService],
   imports: [
      CommonModule
   ],
   exports: [
      ParserService
   ]
})
export class ParserModule {}
