import { ArchitectConfig } from '@ioc:Adonis/Core/Architect'

const architectConfig: ArchitectConfig = {
	domains: ['users', 'projects', 'news'],
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
    },
    security: {
      prefix: '',
      as: 'security'
    },
    news: {
      prefix: '',
      as: 'news'
    }
	},
}

export default architectConfig
