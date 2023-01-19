import { Module, forwardRef } from '@nestjs/common';

import { BotUpdate } from './bot.update';
import { CommonModule } from 'src/common/common.module';
import { ParserModule } from 'src/parser/parser.module';

@Module({
   providers: [BotUpdate],
   imports: [
      forwardRef(() => ParserModule),
      CommonModule,
   ],
   exports: [
      BotUpdate
   ]
})
export class TelegramBotModule {}
