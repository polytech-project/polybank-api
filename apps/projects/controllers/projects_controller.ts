import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectService from '../services/project_service'
import { StoreValidator, UpdateValidator } from '../validators/project_validator'
import User from 'Domains/users/models/user'
import {inject} from '@adonisjs/fold'
import Logger from "@ioc:Adonis/Core/Logger";

function proposeRepaymenst(data: {id: string, username: string, amount: string}[]) {
  // Triez les utilisateurs par montant croissant
  const sortedUsers = data.slice().sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))

  const balances: Record<string, number> = {}
  sortedUsers.forEach(user => (balances[user.id] = parseFloat(user.amount)))

  const repayments: { from: string, to: string, amount: number }[] = []

  for (const user of sortedUsers) {
    while (balances[user.id] < 0) {
      const recipient = sortedUsers.find(recipient => balances[recipient.id] > 0)

      if (!recipient) {
        break; // Aucun utilisateur à rembourser
      }

      const amount = Math.min(-balances[user.id], balances[recipient.id])

      balances[user.id] += amount
      balances[recipient.id] -= amount

      repayments.push({ from: recipient.username, to: user.username, amount })
    }
  }

  return repayments
}
@inject()
export default class ProjectsController {
  public projectService = ProjectService

	public async index({ request, response, bouncer, auth }: HttpContextContract) {
		const { me, page = 1, size = 10, transactions, users } = request.qs()
    const user = auth.user as User

		if (me) {
			const projects = await this.projectService.findByUserId(user.id, page, size)

			return response.send(projects)
		}

    await bouncer.with('ProjectPolicy').authorize('view')

		const projects = await this.projectService.findAll(page, size, !!transactions, !!users)
		return response.send(projects)
	}

	public async show({ params, response, bouncer }: HttpContextContract) {
		const project = await this.projectService.findById(params.id)
		await bouncer.with('ProjectPolicy').authorize('view', project.project || undefined)

		if (!project) {
			return response.notFound()
		}

		return response.send(project)
	}

  public async stats({ params, response }: HttpContextContract) {
    const {project} = await this.projectService.findById(params.id)

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



    return response.send({
      balances,
      remboursements: proposeRepaymenst(balances)
    })
  }

	public async store({ request, response, auth }: HttpContextContract) {
		const data = await request.validate(StoreValidator)
		const user = auth.user as User

		const project = await this.projectService.createProject({
			...data,
			user,
		})

		if (!project) {
			return response.badRequest()
		}

    Logger.info(`ProjetID: ${project.id}`)
    Logger.info(data.users, user.id)

    await project.related('users').attach([...data.users, user.id])

		return response.created(project)
	}

	public async update({ request, params, response, bouncer }: HttpContextContract) {
		const data = await request.validate(UpdateValidator)
		const {project} = await this.projectService.findById(params.id)

		if (!project) {
			return response.notFound()
		}

		await bouncer.with('ProjectPolicy').authorize('update', project)

		const newProject = await this.projectService.updateProject(data, project)

		return response.send(newProject)
	}

	public async delete({ params, response, bouncer }: HttpContextContract) {
		const {project} = await this.projectService.findById(params.id)

		if (!project) {
			return response.notFound()
		}

		await bouncer.with('ProjectPolicy').authorize('delete', project)

		await project.delete()

		return response.send({
			message: 'Project deleted successfully',
			project,
		})
	}
}
