import {BasePolicy} from "@ioc:Adonis/Addons/Bouncer";
import User from "Domains/users/models/user";
import HelperPolicy from "App/shared/policies/helper_policy";

export default class UserPolicy extends BasePolicy {
  public async before(user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view(user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)

    return permissions.includes('view:user')
      || permissions.includes('store:user')
      || permissions.includes('update:user')
      || permissions.includes('delete:user')
  }
}
