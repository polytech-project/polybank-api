import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'users_controller.index').as('users.index')
    }).prefix('/users')
  }).namespace('App/users/controllers').middleware('auth')
}
