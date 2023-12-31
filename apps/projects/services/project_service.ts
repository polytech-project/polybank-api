import Project from 'Domains/projects/models/project'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'Domains/users/models/user'
import {inject} from "@adonisjs/fold";
import BalanceService from "App/projects/services/balance_service";

export interface ProjectStoreContract {
	title: string
	description?: string
	device?: string
	user: User
}

export interface ProjectUpdateContract {
	title?: string
	description?: string
	users?: string[]
}

@inject()
class ProjectService {
  private balanceService = BalanceService
  constructor() {}

  public async findAll(page: number, size: number, transactions?: boolean) {
    return await Project
      .query()
      .if(transactions, (query) => {
        query.preload('transactions')
      })
      .paginate(page || 1, size || 1)
  }

  public async findByUserId(userId: string, page: number, size: number, transactions?: boolean) {
    return await Project
      .query()
      .whereHas('users', (query) => {
        query.where('user_id', userId)
      })
      .if(transactions, (query) => {
        query.preload('transactions')
      })
      .preload('users')
      .paginate(page, size)
  }

  public async findById(projectId: string) {
    const project = await Project.query()
      .where('id', projectId)
      .preload('transactions', (query) => {
        query.preload('paidByUser')
        query.preload('users')
        query.orderBy('created_at', 'desc')
      })
      .preload('users')
      .firstOrFail()

    const balances = await this.balanceService.findByProject(project)

    const expenses = project.transactions.reduce((acc, curr) => acc += curr.amount, 0)
    console.log(balances, expenses)

    return { project, expenses, balances }
  }

	public async createProject(data: ProjectStoreContract): Promise<Project | null> {
		try {
			const project = await Project.create({
				title: data.title,
				description: data.description,
				device: data.device,
				ownerId: data.user.id,
			})

			return project
		} catch (error) {
			Logger.warn(error)
			return null
		}
	}

	public async updateProject(data: any, project: Project) {
		try {
			await project.merge(data).save()

			if (data.users) {
				await project.related('users').sync(data.users)
			}

			return project
		} catch (error) {
			Logger.warn(error)
			return null
		}
	}
}

export default new ProjectService()
