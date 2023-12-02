import Expense from "Domains/projects/models/transaction"
//import Logger from '@ioc:Adonis/Core/Logger'

class TransactionService {
  constructor() {}

  public async findAll(page: number, size: number) {
    return Expense.query()
      .paginate(page, size)
  }

  public async findByUserId(userId: string, page: number, size: number) {
    return Expense.query()
      .where('user_id', userId)
      .paginate(page, size)
  }

  public async findById(expenseId: string) {
    return Expense.query()
      .where('id', expenseId)
      .firstOrFail()
  }
}

export default new TransactionService()
