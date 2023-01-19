import { Module, forwardRef } from '@nestjs/common';
import { ParserModule } from 'src/parser/parser.module';
import { CommonModule } from 'src/common/common.module';
import { BotUpdate } from './bot.update';

@Module({
   imports: [
      forwardRef(() => ParserModule),
      CommonModule
   ],
   providers: [BotUpdate],
})
export class BotModule {}