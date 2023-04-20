/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<any>(ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const getaccessProfile = user?.accessProfileUser.map((a) => a?.accessProfile);
    if (!getaccessProfile) return false;
    const getPermissionProfile = getaccessProfile.map((a) => a?.permissionProfile).flat();
    if (!getPermissionProfile) return false;

    function letsVerifyAction(actionsArr) {
      const verifyPermission = getPermissionProfile.map(
        (a) =>
          a?.permission?.id == requiredRoles?.permission &&
          actionsArr.some((arr) => {
            if (arr == 1) {
              return a.create;
            } else if (arr == 2) {
              return a.read;
            } else if (arr == 3) {
              return a.update;
            } else if (arr == 4) {
              return a.delete;
            } else {
              return false;
            }
          }),
      );
      return verifyPermission;
    }
    const verified = letsVerifyAction(requiredRoles.action).some((a) => !!a);

    return verified;
  }
}
