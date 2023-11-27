import { test } from '@japa/runner'
import User from 'Domains/users/models/user'


test.group('Projects list', () => {
  test('projects user', async ({ client }) => {
    const user = await User.first()
    
    await client.get('/projects?onlyUser=true')
      .guard('api')
      .loginAs(user!)
    
  })

  test('projects admin', async ({ client }) => {
    const user = await User.query()
      .where('email', 'pro.nathaelbonnal@gmail.com')
      .first()
    
    const response = await client.get('/projects')
      .guard('api')
      .loginAs(user!)

    response.assertStatus(200)  
  })
})
