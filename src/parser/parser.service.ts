import puppeteer from 'puppeteer'
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';

import { Context } from 'src/bot/context.interface';
import { UsersService } from 'src/common/users.service';
import { ProductsService } from 'src/common/products.service';
import { ChannelService } from 'src/common/channels.service';

@Injectable()
export class ParserService implements OnModuleInit {
   constructor(
      @InjectBot() private bot: Telegraf<Context>,
      private productService: ProductsService,
      private usersService: UsersService,
      private channelService: ChannelService,
   ) {}

   async checkProducts() {
      const existProducts = await this.productService.findAll()
      console.log(`Товаров в мониторинге: ${existProducts.length}`)
      if(existProducts.length > 0) {
         const browser = await this.launchBroser()
         for (let product of existProducts) {
            console.log(product.id)
            const page = await browser.newPage()
            try {
               await page.goto(product.url, {
                  waitUntil: 'networkidle2', timeout: 120000
               })
               await this.clickRegion(page)
               try {
                  const receiptDate = await page.evaluate(() => {
                     return document.querySelector('[class*="eta-dates---etaDates---"]').textContent.replace(/^\s+/g, '')
                  })
                  // await this.checkedNotify(product, receiptDate)
               } catch (error) {
                  await this.channelNotify(product)
                  // await this.productService.delete(product.id)
               }
            } catch (error) {
               await browser.close()
               this.checkProducts()
            }
         }
         await browser.close()
      }
   }

   async channelNotify(product) {
      const channels = await this.channelService.findAll()
      channels.map(async (channel) => {
         try {
            await this.bot.telegram.sendMessage(channel.channelId, `Товар <b>${product.title}</b> появился в продаже\n---\n${product.url}`, {
               parse_mode: 'HTML', disable_web_page_preview: true
            })
         } catch (error) {
            console.log('В канале нет бота')
         }
      })
   }

   async checkedNotify(product, receiptDate) {
      // console.log(product.id)
      const users = await this.usersService.findAll()
      users.map(async (user) => {
         try {
            await this.bot.telegram.sendMessage(user.tgId, `Товар <b>${product.title}</b> успешно проверен\n---\n${receiptDate}\n${product.url}`, {
               parse_mode: 'HTML', disable_web_page_preview: true
            })
         } catch (error) {
            console.log(error)
            console.log('111')
         }
      })
   }


   async parseNewProduct(url) {
      const browser = await this.launchBroser()
      const result = {
         error: true, text: null
      }
      const newTab = await browser.newPage()
      try {
         await newTab.goto(url, {
            waitUntil: 'networkidle2', timeout: 120000
         })
      } catch (error) {
         console.log('неправильный url')
         await newTab.close()
         result.text = 'Проверьте правильность указанного URL'
         return result
      }
      try {
         result.text = await newTab.evaluate(() => {
            return document.querySelector('span.product-details__title-txt').textContent
         })
         result.error = false
         await newTab.close()
      } catch (error) {
         console.log('товар не найден')
         await newTab.close()
         result.text = 'Товар по указанной ссылке не найден'
      }
      await browser.close()
      return result
   }

   async clickRegion(page) {
      try {
         await page.click('[class*="confirmation---body---"] button + button')
      } catch (error) {
         return
      }
   }
   async launchBroser() {
      return puppeteer.launch({
         headless: false,
         defaultViewport: null,
         args: [
            '--disable-notifications',
            '--window-size=1920,1020',
            '--no-sandbox',
         ]
      })
   }

   async onModuleInit() {
      this.checkProducts()
   }
}

