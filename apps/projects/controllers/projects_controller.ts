import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectService from '../services/project_service'
import { StoreValidator, UpdateValidator } from '../validators/project_validator'
import User from 'Domains/users/models/user'
import {inject} from '@adonisjs/fold'
import Logger from "@ioc:Adonis/Core/Logger";

@inject()
export default class ProjectsController {
  public projectService = ProjectService

	public async index({ request, response, bouncer, auth }: HttpContextContract) {
		const { me, page = 1, size = 10, transactions } = request.qs()
    const user = auth.user as User

		if (me) {
			const projects = await this.projectService.findByUserId(user.id, page, size, !!transactions)

			return response.send(projects)
		}

    await bouncer.with('ProjectPolicy').authorize('view')

		const projects = await this.projectService.findAll(page, size, !!transactions)
		return response.send(projects)
	}

	public async show({ params, response, bouncer }: HttpContextContract) {
		const project = await this.projectService.findById(params.id)
		await bouncer.with('ProjectPolicy').authorize('view', project || undefined)

		if (!project) {
			return response.notFound()
		}

		return response.send(project)
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
		const project = await this.projectService.findById(params.id)

		if (!project) {
			return response.notFound()
		}

		await bouncer.with('ProjectPolicy').authorize('update', project)

		const newProject = await this.projectService.updateProject(data, project)

		return response.send(newProject)
	}

	public async delete({ params, response, bouncer }: HttpContextContract) {
		const project = await this.projectService.findById(params.id)

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
