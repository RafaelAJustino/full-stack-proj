/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AccessProfile, Prisma } from '@prisma/client';
import ERRORS from '../../../utils/errors';
import { PrismaService } from '../../external/services/prisma.service';

@Injectable()
export class AccessProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(params: Prisma.AccessProfileFindUniqueArgs): Promise<AccessProfile | null> {
    return this.prisma.accessProfile.findUnique({
      ...params,
      include: {
        permissionProfile: {
          include: {
            permission: true,
            accessProfile: true,
          },
        },
        accessProfileUser: {
          include: {
            user: {
              include: {
                profile: true,
                accessProfileUser: true,
              },
            },
          },
        },
      },
    });
  }

  async find(params: Prisma.AccessProfileFindManyArgs): Promise<AccessProfile[]> {
    const permissions = await this.prisma.accessProfile.findMany({
      ...params,
    });
    return permissions;
  }

  async count() {
    return this.prisma.permission.count();
  }

  async createAccessProfile(data: any): Promise<AccessProfile> {
    return this.prisma.accessProfile.create({
      data: {
        name: data.name,
        description: data.description,
        permissionProfile: {
          createMany: {
            data: data.permissionsProfile,
          },
        },
      },
    });
  }

  async updateAccessProfile(model: any): Promise<AccessProfile> {
    const existingAccessProfile = await this.find({
      where: {
        id: parseInt(model.id),
      },
    });

    if (existingAccessProfile.length > 1) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    const user = existingAccessProfile[0];
    if (user && user.id !== parseInt(model.id)) {
      throw new HttpException(ERRORS.PERMISSION.NAME_USED, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.accessProfile.update({
      where: {
        id: parseInt(model.id),
      },
      data: {
        name: model.name,
        description: model.description,
        permissionProfile: {
          deleteMany: {
            accessProfileId: parseInt(model.id),
          },
          createMany: {
            data: model.permissionsProfile,
          },
        },
      },
    });
  }

  async deleteAccessProfile(where: Prisma.AccessProfileWhereUniqueInput) {
    return this.prisma.accessProfile.delete({
      where,
    });
  }
}
