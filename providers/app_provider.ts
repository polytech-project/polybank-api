import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
	constructor(protected app: ApplicationContract) {}

	public async register() {}

	public async boot() {
}

	public async ready() {
		// App is ready
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
