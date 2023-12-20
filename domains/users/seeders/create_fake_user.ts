import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "Domains/users/models/user";

export default class extends BaseSeeder {
  public async run () {
    await User.create({
      email: 'arnaud.castelltort@gmail.com',
      password: 'lapinlapin',
      username: 'Arnaud Castelltort',
      isVerified: true,
      avatarUrl: 'https://www.polytech.umontpellier.fr/images/ACTUS/2018/acastelltort.jpg'
    })

    await User.create({
      email: 'tristan@antagoniste.com',
      password: 'niquevuejs',
      avatarUrl: 'https://avatars.githubusercontent.com/u/90451752?v=4'
    })
  }
}
