import { User as _User } from './user';
import { UserProfile as _UserProfile } from './user_profile';
import { Permission as _Permission } from './permission';
import { PermissionProfile as _PermissionProfile } from './permission_profile';
import { AccessProfile as _AccessProfile } from './access_profile';
import { AccessProfileUser as _AccessProfileUser } from './access_profile_user';
import { Client as _Client } from './client';
import { Proposal as _Proposal } from './proposal';

export namespace PrismaModel {
  export class User extends _User {}
  export class UserProfile extends _UserProfile {}
  export class Permission extends _Permission {}
  export class PermissionProfile extends _PermissionProfile {}
  export class AccessProfile extends _AccessProfile {}
  export class AccessProfileUser extends _AccessProfileUser {}
  export class Client extends _Client {}
  export class Proposal extends _Proposal {}

  export const extraModels = [
    User,
    UserProfile,
    Permission,
    PermissionProfile,
    AccessProfile,
    AccessProfileUser,
    Client,
    Proposal,
  ];
}
