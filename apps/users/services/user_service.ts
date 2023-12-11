import User from 'Domains/users/models/user'
import {inject} from '@adonisjs/fold'

interface ParamsFindAll {
  search: string,
  excludeSelf: boolean,
  page: number, perPage?: number,
  sortField: string, sortOrder: "asc" | "desc"
}
@inject()
class UserService {


  public async findAll({ search, excludeSelf, page, perPage, sortField, sortOrder }: ParamsFindAll, userId: string) {
    return User.query()
      .if(excludeSelf, (query) => {
        query.whereNot('id', userId)
      })
      .if(search, (query) => {
        query.whereILike('username', `%${search}%`)
      })
      .if((sortField && sortOrder), (query) => {
        query.orderBy(sortField, sortOrder)
      })
      .paginate(page, perPage)
  }
}

export default new UserService()
