/**
 * @adonisjs/architect
 */

declare module '@ioc:Adonis/Core/Architect' {
  import { ArchitectManagerContract } from '@ioc:Adonis/Core/Architect'

  interface ContainerBindings {
    'Adonis/Core/Architect': ArchitectManagerContract
  }
}
