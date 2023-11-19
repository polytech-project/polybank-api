import { type HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Project from "Domains/projects/models/project"
import ProjectService from "../services/project_service"
import { StoreValidator, UpdateValidator } from "../validators/project_validator"
import User from "Domains/users/models/user"

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

  public async show ({ params, response }: HttpContextContract) {
    // bouncer authorize 'projects', 'view'
    const project = await ProjectService.getProjectById(params.id)

    if (!project) {
      return response.notFound()
    }

    return response.send(project)
  }
  
  public async store ({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const user = auth.user as User

    const project = await ProjectService.createProject({
      ...data, user
    })

    if (!project) {
      return response.badRequest()
    }

    return response.created(project)
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const project = await ProjectService.getProjectById(params.id)

    if (!project) {
      return response.notFound()
    }

    const newProject = await ProjectService.updateProject(data, project)

    return response.send(newProject)
  }

  public async delete ({ params, response }: HttpContextContract) {
    const project = await ProjectService.getProjectById(params.id)

    if (!project) {
      return response.notFound()
    }

    await project.delete()

    return response.send({
      message: 'Project deleted successfully',
      project
    })
  }
}