import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/user'
import HelperPolicy from 'App/shared/policies/helper_policy'
import Transaction from "Domains/projects/models/transaction";

export default class TransactionPolicy extends BasePolicy {
  public async before(user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view(user: User, transaction?: Transaction) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    await user.load('projects')
    const projectsId = user.projects.map((p) => p.id)

    if (transaction && projectsId.includes(transaction.projectId)) {
      return true
    }

    return permissions.includes('view:transactions')
      || permissions.includes('store:transactions')
      || permissions.includes('update:transactions')
      || permissions.includes('delete:expetransactionsnses')
  }

  public async update(user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)

    return permissions.includes('update:transactions')
  }

  public async delete (user: User, transaction: Transaction) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)

    if (transaction.userId === user.id || transaction.project.ownerId === user.id) {
      return true
    }

    return permissions.includes('delete:transactions')
  }
}
