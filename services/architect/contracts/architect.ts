declare module '@ioc:Adonis/Core/Architect' {
  export interface ArchitectApplication {
    prefix?: string
    middleware?: string[]
    domain?: string
    as?: string
  }

  export interface ArchitectConfig {
    domains: string[]
    applications: { [k: string]: ArchitectApplication }
  }

  export interface ArchitectManagerContract {
    registerDomains(): void
    registerRoutes(): void
  }

  const Architect: ArchitectManagerContract
  export default Architect
}
