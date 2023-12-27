import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'news_controller.index').as('news.index')
      Route.post('/', 'news_controller.store').as('news.store')
      Route.post('/check/:id', 'news_controller.check').as('news.check')
      Route.put('/:id', 'news_controller.update').as('news.update')
    }).prefix('/news')
  }).namespace('App/news/controllers').middleware(['auth', 'throttle:global'])
}
