import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';

import { Context } from './context.interface';
import { ChannelService } from 'src/common/channels.service';
import { ProductsService } from 'src/common/products.service';
import { ParserService } from 'src/parser/parser.service';

@Update()
export class BotUpdate {
   constructor(
      @InjectBot()
      private readonly bot: Telegraf<Context>,
      private readonly channelService: ChannelService,
      private readonly productsService: ProductsService,
      private readonly parserService: ParserService
   ) {}

   @Start()
   async startCommand(ctx: Context) {
      const userId = ctx.message.from.id
      ctx.session.path = 'home'
      await ctx.reply('🤖')
      await ctx.reply('Для управления товарами, нажмите кнопку ниже',
      Markup.keyboard([
         Markup.button.callback('🛒 Мои товары', 'list'),
      ]).resize())
   }

   // Список товаров
   @Hears('🛒 Мои товары')
   async editProducts(ctx: Context) {
      ctx.session.path = 'products'
      const products = await this.productsService.findAll()
      await ctx.reply(`🛒`)
      if(products.length > 0) {
         await ctx.reply(`Для удаления товара из мониторинга, нажмите на соотвествующую кнопку:`, {
            reply_markup: {
               inline_keyboard: this.productsKeyboard(products)
            }
         })
      }
      await ctx.reply(`Чтобы добавить новый товар, отправьте в чат его url`)
   }

   @On('callback_query')
   async deleteProduct(@Ctx() ctx: Context) {
      const query = ctx.update['callback_query'].data
      if(query.includes('delete_')) {
         const productId = parseInt(query.split('delete_')[1])
         await this.productsService.delete(productId)
         const products = await this.productsService.findAll()
         await ctx.reply(`Товар успешно удалён`, {
            reply_markup: {
               inline_keyboard: this.productsKeyboard(products)
            }
         })
      }
   }

   @On('message')
   async testMessage(@Message('text') productUrl: string, @Ctx() ctx: Context) {
      if(ctx.session.path === 'products') {
         const existProduct = await this.productsService.checkExist(productUrl)
         if(existProduct) {
            ctx.reply(`🚫 Товар уже был добавлен ранее`, {
               disable_web_page_preview: true
            })
            return
         }
         if(!productUrl.includes('kz.amway.com')) {
            ctx.reply('Указан неверный сайт, или неправильная ссылка')
            return
         }
         if(productUrl.includes('kz.amway.com')) {
            const msg = await ctx.reply('⏱')
            const product = await this.parserService.parseNewProduct(productUrl)
            if(product.error) {
               ctx.reply(`${product.text}:\n${productUrl}`)
            }
            if(!product.error) {
               await this.productsService.add({
                  url: productUrl,
                  title: product.text
               })
               ctx.reply(`Товар\n${product.text}\nуспешно добавлен`, {
                  disable_web_page_preview: true
               })
            }
            ctx.deleteMessage(msg['message_id'])
            console.log(msg['message_id'])
         }
      }
   }

   // При добавлении / удалении бота в канал
   @On('my_chat_member')
   async my_chat_member(@Ctx() ctx: Context) {
      const action = ctx.update['my_chat_member']
      const newChannelId = action.chat.id.toString()
      if(action.new_chat_member.status === 'administrator') {
         this.channelService.addNew(newChannelId)
      }
      const existChannel = await this.channelService.findAll()
      const isApprovedChannel = existChannel.filter((channelId) => channelId === newChannelId)
      console.log(isApprovedChannel)
   }

   productsKeyboard(product) {
      const data = []
      for (let item of product) {
         data.push([{
            text: `❌ ${item.title}`, callback_data: `delete_${item.id}`
         }])
      }
      return data
   }
}