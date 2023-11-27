import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "Domains/users/models/role"
import Permission from "../models/permission";
import User from "../models/user";

export default class extends BaseSeeder {
  public async run() {
    // Create roles
    const admin = await Role.firstOrCreate({
      label: 'Administrateur'
    }, {
      label: 'Administrateur', power: 100
    })

    const permAdmin = await Permission.firstOrCreate({
      identifier: 'admin'
    }, {
      identifier: 'admin'
    })

    await admin.related('permissions').sync([permAdmin.id])

    const user = await User.findByOrFail('email', 'pro.nathaelbonnal@gmail.com')

    await user.load('roles')
    await user.related('roles').sync([admin.id, ...user.roles.map((i) => i.id)])
  }
}