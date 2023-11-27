/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
	return { hello: 'world' }
})

Route.post('/rabbit', async ({}) => {
  await Rabbit.assertQueue('test', { durable: false })

  Logger.info('Sending message to queue')
  const message = {
    iss: '',
    sub: 'pro.nathaelbonnal@gmail.com',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }

  await Rabbit.sendToQueue('test', message)
  return { hello: 'world' }
})
