import Transaction from "Domains/projects/models/transaction"
import Logger from '@ioc:Adonis/Core/Logger'

export default class TransactionService {
  public static async getByProject(projectId: string, page?: number, size?: number) {
    try {
      return await Transaction
        .query()
        .where('project_id', projectId)
        .paginate(page || 1, size || 10)
    } catch (error) {
      Logger.warn(error)
    }
  }
}