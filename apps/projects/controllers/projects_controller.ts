import { type HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Project from "Domains/projects/models/project"
import ProjectService from "../services/project_service"

export default class ProjectsController {
  public async index ({ request, response }: HttpContextContract) {
    const { userId } = request.qs()

    if (userId) {
      // bouncer authorize 'projects', 'view'
      const projects = await ProjectService.getProjectsByUserId(userId)

      return response.send(projects)
    }

    // bouncer authorize 'projects', 'view' 
    return Project.query()
  }
}