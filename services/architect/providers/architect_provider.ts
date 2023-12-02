import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ArchitectManagerContract } from '@ioc:Adonis/Core/Architect'

export default class ArchitectProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  public register(): void {
    this.app.container.singleton('Adonis/Core/Architect', () => {
      const { ArchitectManager } = require('../architect_manager')
      return new ArchitectManager(this.app)
    })
  }

  public async boot() {
    const architect: ArchitectManagerContract =
      this.app.container.resolveBinding('Adonis/Core/Architect')

    architect.registerDomains()
    await architect.registerRoutes()
  }
}
