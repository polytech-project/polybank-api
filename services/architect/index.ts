import { type ArchitectContract } from './contracts/architect_contract'
import { RouterContract, RouteGroupContract } from '@ioc:Adonis/Core/Route'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ArchitectApplicationContract } from './contracts/architect_application_contract'
import { ArchitectConfigContract } from './contracts/architect_config_contract'

export default class Architect implements ArchitectContract {
	constructor(protected app: ApplicationContract) {}

	registerDomains(): void {
		const domains = this.app.config.get('architect.domains', [])
		const connections = this.app.config.get('database.connections')

		domains.forEach((name: string) => {
			Object.entries(connections).forEach(([_, connection]: [string, any]) => {
				const migrations = 'paths' in connection['migrations'] ? connection['migrations']['paths'] : []
				migrations.push(this.app.makePath('domains', name, 'migrations'))

				if (!('seeders' in connection)) {
					connection['seeders'] = { paths: [] }
				}

				const seeders = 'paths' in connection['seeders'] ? connection['seeders']['paths'] : []
				seeders.push(this.app.makePath('domains', name, 'seeders'))

				connection['migrations']['paths'] = migrations
				connection['seeders']['paths'] = seeders
			})
		})
	}

	public async registerRoutes(): Promise<void> {
		const Route: RouterContract = this.app.container.resolveBinding('Adonis/Core/Route')
		const architect: ArchitectConfigContract = this.app.config.get('architect', {})

		await Promise.all(
			Object.entries(architect.applications).map(async ([name, application]) => {
				const { default: RouteHandler } = await import(this.app.makePath('apps', name, 'routes'))
				const group = Route.group(RouteHandler)
				console.log(application)
				group.namespace('apps/' + name + '/controllers')

				this.applyRouteParameter(group, application, 'prefix')
				this.applyRouteParameter(group, application, 'middleware')
				this.applyRouteParameter(group, application, 'domain')
				this.applyRouteParameter(group, application, 'as')
			})
		)
	}

	private applyRouteParameter(
		route: RouteGroupContract,
		application: ArchitectApplicationContract,
		attribute: keyof ArchitectApplicationContract
	) {
		if (application[attribute]) {
			route[attribute](application[attribute] as any)
		}
	}
}
