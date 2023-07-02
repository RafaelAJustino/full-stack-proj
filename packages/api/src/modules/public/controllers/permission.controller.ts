/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Post, Req, UseGuards, Put, Get, Inject } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { HttpExceptionResponse } from '../../../types/classes/error.class';
import { PaginatedDto } from '../../../types/dtos/page.dto';
import { API_VERSIONS, API_VERSION_HEADER } from '../../../utils/consts';
import { PrismaService } from '../../external/services/prisma.service';
import { PermissionService } from '../services/permission.service';
import { RolesGuard } from '../../../roles/role.guard';
import { RolePermission } from '../../../roles/rolePermission.enum';
import { Roles } from '../../../roles/role.decorator';
import { RoleAction } from '../../../roles/roleAction.enum';
import { MonitoringService } from '../../monitoring/monitoring.service';
import { RedisService } from '../../../config/redis';

@ApiTags('Permissão')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@Controller({
  path: 'permission',
  version: API_VERSIONS,
})
@ApiUnauthorizedResponse({
  description: 'Usuário não autenticado',
  type: HttpExceptionResponse,
})
@Throttle()
@UseGuards(RolesGuard)
// @Roles(rolePermission.Permission, [RoleAction.READ])
@ApiBearerAuth()
export class PermissionController {
  constructor(
    @Inject(MonitoringService)
    private readonly monitoringService: MonitoringService,
    private readonly prismaService: PrismaService,
    private readonly permissionService: PermissionService,
    private readonly redis: RedisService,
  ) {}

  @ApiOperation({
    summary: 'lista todas as permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('list-all')
  async getListAll() {
    const cachedPermission = await this.redis.get(`permission/list-all`);

    if (!cachedPermission) {
      const permissions = await this.prismaService.permission.findMany();

      this.monitoringService.log('ERRO no permission/list-all');

      await this.redis.set(`permission/list-all`, JSON.stringify(permissions));

      return permissions;
    }

    return JSON.parse(cachedPermission);
  }

  @ApiOperation({
    summary: 'lista permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Post('list')
  async getList(@Body() model: PaginatedDto) {
    const skip = (model.page - 1) * model.perPage;
    const take = model.perPage;

    const cachedPermission = await this.redis.get(`permission/list/${skip}-${take}`);

    if (!cachedPermission) {
      const permissions = await this.prismaService.permission.findMany({
        skip: skip,
        take: take,
        where: {
          name: {
            contains: model.search,
          },
        },
      });
      const countPermissions = await this.permissionService.count();

      this.monitoringService.log('ERRO no permission/list');

      await this.redis.set(
        `permission/list/${skip}-${take}`,
        JSON.stringify({
          data: permissions,
          page: model.page,
          perPage: model.perPage,
          total: countPermissions,
        }),
      );

      return {
        data: permissions,
        page: model.page,
        perPage: model.perPage,
        total: countPermissions,
      };
    }
    return JSON.parse(cachedPermission);
  }

  @ApiOperation({
    summary: 'Busca uma permissão pelo id',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('list/:id')
  async getOnePermission(@Req() req: any) {
    const id = req.params.id;

    const cachedPermission = await this.redis.get(`permission/list/${id}`);
    if (!cachedPermission) {
      const permissions = await this.prismaService.permission.findMany({
        include: {
          permissionProfile: {
            include: {
              permission: true,
            },
          },
        },
        where: {
          id: {
            equals: id,
          },
        },
      });

      this.monitoringService.log('ERRO no permission/list/:id');

      // const users = await this.permissionService.findOne(userId){
      //   where: { id: parseInt(req.params.id) },
      // });
      await this.redis.set(`permission/list/${id}`, JSON.stringify(permissions));

      return permissions;
    }
    return JSON.parse(cachedPermission);
  }

  @ApiOperation({
    summary: 'traz o total de permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('count')
  async CountPermissions() {
    const users = await this.permissionService.count();

    this.monitoringService.log('ERRO no permission/count');

    return users;
  }

  @ApiOperation({
    summary: 'Cria permissão',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.CREATE])
  @Post('create')
  async createPermission(@Body() model: any) {
    const data = this.permissionService.createPermission(model);

    this.monitoringService.log('ERRO no permission/create');

    return data;
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualiza permissão',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.UPDATE])
  async updatePermission(@Req() req: Request, @Body() model: any) {
    await this.permissionService.updatePermission(model);
    await this.redis.del(`permission/list/${model.id}`);
    await this.redis.del(`permission/list-all`);
    this.monitoringService.log('ERRO no permission/update');
  }

  @Put('delete')
  @ApiOperation({
    summary: 'Deleta um usuário',
  })
  @ApiOkResponse({
    description: 'Permissão deletada com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.DELETE])
  async deletePermission(@Body() model: any) {
    await this.permissionService.deletePermission({ id: model.id });
    await this.redis.del(`permission/list/${model.id}`);
    await this.redis.del(`permission/list-all/${model.id}`);
    this.monitoringService.log('ERRO no permission/delete');
  }

  // Referente a permission Profile

  @ApiOperation({
    summary: 'lista todas as permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('profile/list-all')
  async getListAllPermissionProfile() {
    const cachedAccessProfile = await this.redis.get(`access-profile/list-all`);

    if (!cachedAccessProfile) {
      const permissions = await this.prismaService.permissionProfile.findMany({
        include: {
          accessProfile: true,
          permission: true,
        },
      });

      await this.redis.set(`access-profile/list-all`, JSON.stringify(permissions));

      return permissions;
    }
    return JSON.parse(cachedAccessProfile);
  }

  @ApiOperation({
    summary: 'lista permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Post('profile/list')
  async getListPermissionProfile(@Body() model: PaginatedDto) {
    const permissions = await this.prismaService.permissionProfile.findMany({
      skip: (model.page - 1) * model.perPage,
      take: model.perPage,
      include: {
        accessProfile: {
          include: {
            accessProfileUser: {
              include: {
                user: true,
              },
            },
          },
        },
        permission: true,
      },
      where: {
        accessProfile: {
          name: {
            contains: model.search,
          },
        },
      },
    });
    const countPermissions = await this.permissionService.countPermissionProfile();

    this.monitoringService.log('ERRO no permission/profile/list');

    return {
      data: permissions,
      page: model.page,
      perPage: model.perPage,
      total: countPermissions,
    };
  }

  @ApiOperation({
    summary: 'Busca uma permissão pelo id',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('profile/list/:id')
  async getOnePermissionProfile(@Req() req: any) {
    const id = req.params.id;

    const cachedPermissionProfile = await this.redis.get(`permission-profile/list/${id}`);
    if (!cachedPermissionProfile) {
      const permissions = await this.prismaService.permissionProfile.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          accessProfile: true,
          permission: true,
        },
      });

      this.monitoringService.log('ERRO no permission/profile/list/:id');

      await this.redis.set(`permission-profile/list/${id}`, JSON.stringify(permissions));

      return permissions;
    }
    return JSON.parse(cachedPermissionProfile);
  }

  @ApiOperation({
    summary: 'traz o total de permissões',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.READ])
  @Get('profile/count')
  async CountPermissionProfile() {
    const users = await this.permissionService.countPermissionProfile();

    this.monitoringService.log('ERRO no permission/profile/count');

    return users;
  }

  @ApiOperation({
    summary: 'Cria permissão',
  })
  @ApiOkResponse({
    description: '',
    // type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.CREATE])
  @Post('profile/create')
  async createPermissionProfile(@Body() model: any) {
    const data = this.permissionService.createPermissionProfile(model);

    this.monitoringService.log('ERRO no permission/profile/create');

    return data;
  }

  @Put('profile/update')
  @ApiOperation({
    summary: 'Atualiza permissão',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.UPDATE])
  async updatePermissionProfile(@Req() req: Request, @Body() model: any) {
    await this.permissionService.updatePermissionProfile(model);
    await this.redis.del(`permission/profile/list/${model.id}`);
    await this.redis.del(`permission/profile/list-all`);
    this.monitoringService.log('ERRO no permission/profile/update');
  }

  @Put('profile/delete')
  @ApiOperation({
    summary: 'Deleta um usuário',
  })
  @ApiOkResponse({
    description: 'Permissão deletada com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.DELETE])
  async deletePermissionProfile(@Body() model: any) {
    await this.permissionService.deletePermissionProfile({ id: model.id });
    await this.redis.del(`permission/profile/list/${model.id}`);
    await this.redis.del(`permission/profile/list-all`);
    this.monitoringService.log('ERRO no permission/profile/delete');
  }
}
