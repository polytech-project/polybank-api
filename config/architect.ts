import { ArchitectConfig } from '@ioc:Adonis/Core/Architect'

const architectConfig: ArchitectConfig = {
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
    users: {
      prefix: '',
      as: 'users'
    }

	},
}

export default architectConfig
