import Route from '@ioc:Adonis/Core/Route'

export default () => {

  Route.group(() => {
    Route.group(() => {

    }).middleware('auth')
  }).namespace('App/projects/controllers')
}