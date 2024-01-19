import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "Domains/users/models/user";
import Role from "Domains/users/models/role";

export default class extends BaseSeeder {
  public async run () {
    const user = await User.create({
      email: 'nathael@bonnal.cloud',
      password: 'lapinlapin',
      username: 'Nathael Bonnal',
      isVerified: true,
      avatarUrl: '',
    })

    const adminRole = await Role.findByOrFail('label', 'Administrateur')

    await user.related('roles').create(adminRole)
  }
}
