import Project from "Domains/projects/models/project";

class BalanceService {
  public async findByProject(project: Project) {
    return project.users.map((user) => {
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
  }
}

export default new BalanceService()
