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
	public static async getProjectsByUserId(userId: string): Promise<Project[] | undefined> {
		try {
			const projects = await Project.query().whereHas('users', (query) => {
				query.where('user_id', userId)
			})

			return projects
		} catch (error) {
			Logger.warn(error)
		}
	}

	public static async getProjectById(projectId: string): Promise<Project | null> {
		try {
			const project = await Project.query()
				.where('id', projectId)
				//.preload('users')
				.firstOrFail()

			return project
		} catch (error) {
			Logger.warn(error)
			return null
		}
	}

	public static async createProject(data: ProjectStoreContract): Promise<Project | null> {
		try {
			const project = await Project.create(data)

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
