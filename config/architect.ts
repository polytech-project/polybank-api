import { ArchitectConfigContract } from 'services/architect/contracts/architect_config_contract'

const architectConfig: ArchitectConfigContract = {
	domains: ['users', 'projects'],
	applications: {
		authentication: {
			prefix: 'authentication',
			as: 'authentication',
		},
		projects: {
			prefix: 'projects',
			as: 'projects',
		},
	},
}

export default architectConfig
