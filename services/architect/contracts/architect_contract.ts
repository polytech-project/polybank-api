export interface ArchitectContract {
  registerDomains(): void
  registerRoutes(): Promise<void>
}