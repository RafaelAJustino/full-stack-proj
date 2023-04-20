/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Permission, PermissionProfile, Prisma } from '@prisma/client';
import ERRORS from '../../../utils/errors';
import { PrismaService } from '../../external/services/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(params: Prisma.PermissionFindUniqueArgs): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      ...params,
      include: {
        permissionProfile: {
          include: {
            permission: true,
            accessProfile: true,
          },
        },
      },
    });
  }

  async find(params: Prisma.PermissionFindManyArgs): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      ...params,
    });
    return permissions;
  }

  async count() {
    return this.prisma.permission.count();
  }

  async createPermission(data: any) {
    const permission = await this.prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    data.accessProfileIds.map(async (a) => {
      await this.prisma.permissionProfile.create({
        data: {
          create: data.create,
          read: data.read,
          update: data.update,
          delete: data.delete,
          accessProfileId: a,
          permissionId: permission.id,
        },
      });
    });

    return true;
  }

  async updatePermission(model: any): Promise<Permission> {
    const existingPermission = await this.find({
      where: {
        id: model.id,
      },
    });

    if (existingPermission.length > 1) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    const perm = existingPermission[0];
    if (perm && perm.id !== model.id) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.permission.update({
      where: {
        id: model.id,
      },
      data: model,
    });
  }

  async deletePermission(where: Prisma.PermissionWhereUniqueInput) {
    return this.prisma.permission.delete({
      where,
    });
  }

  // Referente a permission Profile

  async findOnePermissionProfile(
    params: Prisma.PermissionProfileFindUniqueArgs,
  ): Promise<PermissionProfile | null> {
    return this.prisma.permissionProfile.findUnique({
      ...params,
    });
  }

  async findPermissionProfile(
    params: Prisma.PermissionProfileFindManyArgs,
  ): Promise<PermissionProfile[]> {
    const permissions = await this.prisma.permissionProfile.findMany({
      ...params,
    });
    return permissions;
  }

  async countPermissionProfile() {
    return this.prisma.permissionProfile.count();
  }

  async createPermissionProfile(data: any) {
    return this.prisma.permissionProfile.create({
      data,
    });
  }

  async updatePermissionProfile(model: any): Promise<PermissionProfile> {
    const existingPermission = await this.find({
      where: {
        id: parseInt(model.id),
      },
    });

    if (existingPermission.length > 1) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    const perm = existingPermission[0];
    if (perm && perm.id !== parseInt(model.id)) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.permissionProfile.update({
      where: {
        id: parseInt(model.id),
      },
      data: {
        permissionId: model.permissionId,
        accessProfileId: model.accessProfileId,
        create: model.create,
        read: model.read,
        update: model.update,
        delete: model.delete,
      },
    });
  }

  async deletePermissionProfile(where: Prisma.PermissionProfileWhereUniqueInput) {
    return this.prisma.permissionProfile.delete({
      where,
    });
  }
}
