import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {StoreValidator} from "App/news/validators/news_validator";
import {inject} from "@adonisjs/fold";
import NewsService from "App/news/services/news_service";

@inject()
export default class NewsController {
  private newsService = NewsService
  public async index({}: HttpContextContract) {

  }

  public async store ({ request, response }: HttpContextContract) {
    // bouncer
    const data = await request.validate(StoreValidator)
    const news = await this.newsService.createNews(data)

    return response.send(news)
  }
}
