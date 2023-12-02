import {
  ArchitectApplication,
  ArchitectConfig,
  ArchitectManagerContract,
} from '@ioc:Adonis/Core/Architect'
import { RouterContract, RouteGroupContract } from '@ioc:Adonis/Core/Route'
import { type ApplicationContract } from '@ioc:Adonis/Core/Application'

export class ArchitectManager implements ArchitectManagerContract {
  constructor(protected application: ApplicationContract) {}

  public registerDomains(): void {
    const domains = this.application.config.get('architect.domains', [])
    const connections = this.application.config.get('database.connections')

    domains.forEach((name: string) => {
      Object.entries(connections).forEach(([_, connection]: [string, any]) => {
        const migrations =
          'paths' in connection['migrations'] ? connection['migrations']['paths'] : []
        migrations.push(this.application.makePath('domains', name, 'migrations'))

        if (!('seeders' in connection)) {
          connection['seeders'] = { paths: [] }
        }

        const seeders = 'paths' in connection['seeders'] ? connection['seeders']['paths'] : []
        seeders.push(this.application.makePath('domains', name, 'seeders'))

        connection['migrations']['paths'] = migrations
        connection['seeders']['paths'] = seeders
      })
    })
  }

  public async registerRoutes(): Promise<void> {
    const Route: RouterContract = this.application.container.resolveBinding('Adonis/Core/Route')
    const architect: ArchitectConfig = this.application.config.get('architect', {})

    await Promise.all(
      Object.entries(architect.applications).map(async ([name, application]) => {
        const { default: RouteHandler } = await import(this.application.makePath('apps', name, 'routes'))
        const group = Route.group(RouteHandler)
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
    application: ArchitectApplication,
    attribute: keyof ArchitectApplication
  ) {
    if (application[attribute]) {
      route[attribute](application[attribute] as any)
    }
  }
}
