import Project from "Domains/projects/models/project";
import User from "Domains/users/models/user";

class RefundService {
  private async getRefundByBalance(data: {id: string, username: string, amount: string}[]) {
    const sortedUsers = data.slice().sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))

    const balances: Record<string, number> = {}
    sortedUsers.forEach(user => (balances[user.id] = parseFloat(user.amount)))

    const refunds: { from: User, to: User, amount: number}[] = []

    for (const user of sortedUsers) {
      while (balances[user.id] < 0) {
        const recipient = sortedUsers.find(recipient => balances[recipient.id] > 0)

        if (!recipient) {
          break; // Aucun utilisateur à rembourser
        }

        const amount = Math.min(-balances[user.id], balances[recipient.id])

        balances[user.id] += amount
        balances[recipient.id] -= amount

        const userFrom = await User.findOrFail(user.id)
        const userTo = await User.findOrFail(recipient.id)

        refunds.push({
          from: userFrom,
          to: userTo,
          amount
        })
      }
    }

    return refunds
  }

  public async getRefundByProject(project: Project) {
    const balances = project.users.map((user) => {
      let amount = 0
      project.transactions.forEach((transaction) => {
        const usersIds = transaction.users.map(u => u.id)
        if (transaction.paidBy === user.id) {
          amount += transaction.amount
        }

        if (usersIds.includes(user.id)) {
          amount -= transaction.amount / transaction.users.length
        }
      })

      return {
        id: user.id,
        username: user.username,
        amount: amount.toFixed(2)
      }
    })

    const refunds = await this.getRefundByBalance(balances)

    return refunds
  }
}

export default new RefundService