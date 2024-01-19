import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { newsFactory } from 'Domains/news/factories/news'
export default class extends BaseSeeder {
  public async run () {
    await newsFactory.createMany(10)
  }
}
