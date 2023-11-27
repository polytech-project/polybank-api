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

export default class ProjectService {
	public static async getProjectsByUserId(userId: string, page?: number, size?: number): Promise<Project[] | undefined> {
		try {
      return await Project
        .query()
				.whereHas('users', (query) => {
					query.where('user_id', userId)
				})
        .paginate(page || 1, size || 10)
		} catch (error) {
			Logger.warn(error)
		}
	}

	public static async getProjects(page: number, size: number, transactions?: boolean, userId?: string) {
		try {			
			return await Project.query()
				.if(transactions, (query) => {
					query.preload('transactions')
				})
				.if(userId, (query) => {
					query.whereHas('users', (query) => {
						query.where('user_id', userId!)
					})
				})
				.paginate(page, size)
		} catch (error) {
			Logger.error(error)
		}
	}

	public static async getProjectById(projectId: string): Promise<Project | null> {
		try {
      return await Project.query()
        .where('id', projectId)
        //.preload('users')
        .firstOrFail()
		} catch (error) {
			Logger.warn(error)
			return null
		}
	}

	public static async createProject(data: ProjectStoreContract): Promise<Project | null> {
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

	public static async updateProject(data: any, project: Project) {
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
