import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {inject} from '@adonisjs/fold'
import TransactionService from '../services/transaction_service'

@inject()
export default class TransactionsController {
  public transactionService = TransactionService

  public async index ({ request, response, bouncer, auth }: HttpContextContract) {
    const { me, page = 1, size = 10 } = request.qs()

    if (me) {
      const transactions = await this.transactionService.findByUserId(auth.user!.id, page, size)
      return response.send(transactions)
    }

    await bouncer.with('TransactionPolicy').authorize('view')
    const transactions = await this.transactionService.findAll(page, size)

    return response.send(transactions)
  }

  public async show ({ params, response, bouncer }: HttpContextContract) {
    const transaction = await this.transactionService.findById(params.id)

    await bouncer.with('TransactionPolicy').authorize('view', transaction)

    return response.send(transaction)
  }

  public async store ({ }: HttpContextContract) {}

  public async update ({ }: HttpContextContract) {}

  public async destroy ({ }: HttpContextContract) {}
}
