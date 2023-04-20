import { SetMetadata } from '@nestjs/common';
import { RolePermission } from './rolePermission.enum';
import { RoleAction } from './roleAction.enum';

export const ROLE = 'role';
export const Roles = (permission: RolePermission, action: RoleAction[]) => {
  return SetMetadata(ROLE, { permission, action });
};
