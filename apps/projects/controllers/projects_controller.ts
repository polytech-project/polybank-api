import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Logger from '@ioc:Adonis/Core/Logger'
import ProjectService from '../services/project_service'
import { StoreValidator, UpdateValidator } from '../validators/project_validator'
import User from 'Domains/users/models/user'

export default class ProjectsController {
	public async index({ request, response, bouncer, auth }: HttpContextContract) {
		const { onlyUser, page = 1, size = 10, transactions } = request.qs()
    const user = auth.user as User

		if (onlyUser) {
			const projects = await ProjectService.getProjects(page, size, transactions ? true : false, user.id)
			
			return response.send(projects)
		}

    await bouncer.with('ProjectPolicy').authorize('view')
		const projects = await ProjectService.getProjects(page, size, transactions ? true : false)

		return response.send(projects)
	}

	public async show({ params, response, bouncer }: HttpContextContract) {
		const project = await ProjectService.getProjectById(params.id)
		await bouncer.with('ProjectPolicy').authorize('view', project || undefined)

		if (!project) {
			return response.notFound()
		}

		return response.send(project)
	}

	public async store({ request, response, auth }: HttpContextContract) {
		const data = await request.validate(StoreValidator)
		const user = auth.user as User

		const project = await ProjectService.createProject({
			...data,
			user,
		})

		if (!project) {
			return response.badRequest()
		}

		return response.created(project)
	}

	public async update({ request, params, response, bouncer }: HttpContextContract) {
		const data = await request.validate(UpdateValidator)
		const project = await ProjectService.getProjectById(params.id)
		
		if (!project) {
			return response.notFound()
		}

		await bouncer.with('ProjectPolicy').authorize('update', project)

		const newProject = await ProjectService.updateProject(data, project)

		return response.send(newProject)
	}

	public async delete({ params, response, bouncer }: HttpContextContract) {
		const project = await ProjectService.getProjectById(params.id)

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
