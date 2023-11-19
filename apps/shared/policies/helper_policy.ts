import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/user'

export default class HelperPolicy extends BasePolicy {
	public async before(user: User | null): Promise<true | undefined> {
		if (user) {
			const permissions: string[] = await HelperPolicy.getPermissions(user)
			if (permissions.includes('admin')) {
				return true
			}
		}
	}

	public static async getPermissions(user: User): Promise<string[]> {
		await user.load('roles', (query) => query.preload('permissions'))

		const permissions: string[] = []

		user.roles.forEach((role) => {
			role.permissions.forEach((permission) => {
				if (!permissions.includes(permission.identifier)) {
					permissions.push(permission.identifier)
				}
			})
		})

		return permissions
	}
}
