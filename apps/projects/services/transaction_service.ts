import Transaction from "Domains/projects/models/transaction"
//import Logger from '@ioc:Adonis/Core/Logger'

class TransactionService {
  constructor() {}

  public async findAll(page: number, size: number) {
    return Transaction.query()
      .paginate(page, size)
  }

  public async findByUserId(userId: string, page: number, size: number) {
    return Transaction.query()
      .where('user_id', userId)
      .paginate(page, size)
  }

  public async findById(expenseId: string) {
    return Transaction.query()
      .where('id', expenseId)
      .firstOrFail()
  }

  public async findByProjectId(projectId: string, page: number, size: number) {
    return Transaction.query()
      .where('project_id', projectId)
      .paginate(page, size)
  }
}

export default new TransactionService()
