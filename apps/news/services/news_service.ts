import News from "Domains/news/models/news";

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
}

export default new NewsService()
