import News from "Domains/news/models/news";
import {DateTime} from "luxon";

interface CreateNewsDTO {
  title: string
  priority: number
  content: string
  start_date: string
  end_date: string
}

class NewsService {
  public async createNews(data: CreateNewsDTO): Promise<News> {
    return News.create(data)
  }

  public async findAll({ actif }) {
    const dateNow = DateTime.now()
    const isoTime = dateNow.toFormat("yyyy-MM-dd HH:mm:ss.SZZ")

    console.log(isoTime)

    return News.query()
      .if(actif, (query) => {
        query.where('start_date', '<=', isoTime)
        query.where('end_date', '>=', isoTime)
      })

  }
}

export default new NewsService()
