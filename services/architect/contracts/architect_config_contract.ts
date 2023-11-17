import { ArchitectApplicationContract } from "./architect_application_contract"

export interface ArchitectConfigContract {
  domains: string[]
  applications: { [k: string]: ArchitectApplicationContract }
}