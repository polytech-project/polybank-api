import Factory from '@ioc:Adonis/Lucid/Factory'
import News from "Domains/news/models/news";
import {DateTime} from "luxon";

export const newsFactory = Factory.define(News, ({ faker }) => {
  return {
    title: faker.commerce.product(),
    content: faker.hacker.phrase(),
    picture: faker.image.avatarGitHub(),
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({
      days: 10
    }),
    priority: faker.number.int({ min: 1, max: 30 }),
  }
}).build()
