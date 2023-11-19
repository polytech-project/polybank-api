declare module '@ioc:Adonis/Core/Application' {
	import { ArchitectContract } from 'services/architect/contracts/architect_contract'

	export interface ContainerBindigs {
		'Adonis/Addons/Architect': ArchitectContract
	}
}
