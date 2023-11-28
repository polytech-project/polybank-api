import Project from 'Domains/projects/models/project'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'Domains/users/models/user'

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

class ProjectService {
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
      .paginate(page, size)
  }

  public async findById(projectId: string) {
    return Project.query()
      .where('id', projectId)
      .firstOrFail()
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
