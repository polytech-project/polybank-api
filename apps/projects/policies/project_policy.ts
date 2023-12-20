import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/user'
import HelperPolicy from 'App/shared/policies/helper_policy'
import Project from 'Domains/projects/models/project'

export default class ProjectPolicy extends BasePolicy {
  public async before(user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view(user: User, project?: Project) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    await user.load('projects')

    const ids = user.projects.map((p) => p.id)

    if (project && (project.ownerId === user.id || ids.includes(project.id))) {
      return true
    }

    return permissions.includes('view:project')
      || permissions.includes('store:project')
      || permissions.includes('update:project')
      || permissions.includes('delete:project')
  }

  public async update(user: User, project: Project) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)

    if (project.ownerId === user.id) return true

    return permissions.includes('update:project')
  }

  public async delete (user: User, project: Project) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)

    if  (project.ownerId === user.id) return true

    return permissions.includes('delete:project')
  }
}
