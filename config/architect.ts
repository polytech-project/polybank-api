import { ArchitectConfigContract } from "services/architect/contracts/architect_config_contract";

const architectConfig: ArchitectConfigContract = {
  domains: ['users'],
  applications: {
    authentication: {
      prefix: 'authentication',
      as: 'authentication',
    }
  }
}

export default architectConfig