import Project from 'Domains/projects/models/project'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ProjectService {
  public static async getProjectsByUserId (userId: string): Promise<Project[] | undefined> {
    try {
      const projects = await Project.query()
        .whereHas('users', (query) => {
          query.where('user_id', userId)
        })

      return projects
    } catch (error) {
      Logger.warn(error)
    }
  }
}