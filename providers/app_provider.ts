import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public async register () {
    const { default: Architect } = await import('Services/architect')

    this.app.container.singleton('Adonis/Addons/Architect', () => {
      return new Architect(this.app)
    })    
  }

  public async boot () {
    const architect = this.app.container.resolveBinding('Adonis/Addons/Architect')
    architect.registerDomains()

    await architect.registerRoutes()
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
