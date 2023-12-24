import Transaction from "Domains/projects/models/transaction"
//import Logger from '@ioc:Adonis/Core/Logger'

interface CreateTransactionDTO {
  title: string
  amount: number
  paid_by: string
  project_id: string
  user_id: string
  users: string[]
}

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
      .preload('users')
      .preload('paidByUser')
      .firstOrFail()
  }

  public async findByProjectId(projectId: string, page: number, size: number) {
    return Transaction.query()
      .where('project_id', projectId)
      .paginate(page, size)
  }

  public async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await Transaction.create({
      ...data,
      projectId: data.project_id,
      type: 'expense'
    })

    await transaction.related('users').sync(data.users)

    return transaction
  }
}

export default new TransactionService()
