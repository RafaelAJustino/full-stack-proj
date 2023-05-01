/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Post, Req, UseGuards, Put, Get } from '@nestjs/common';
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
    private readonly prismaService: PrismaService,
    private readonly permissionService: PermissionService,
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
    const permissions = await this.prismaService.permission.findMany();

    return permissions;
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
    const permissions = await this.prismaService.permission.findMany({
      skip: (model.page - 1) * model.perPage,
      take: model.perPage,
      where: {
        name: {
          contains: model.search,
        },
      },
    });
    const countPermissions = await this.permissionService.count();

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
  @Get('list/:id')
  async getOnePermission(@Req() req: any) {
    const id = req.params.id;
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

    // const users = await this.permissionService.findOne(userId){
    //   where: { id: parseInt(req.params.id) },
    // });

    return permissions;
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
    return this.permissionService.createPermission(model);
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
    const permissions = await this.prismaService.permissionProfile.findMany({
      include: {
        accessProfile: true,
        permission: true,
      },
    });

    return permissions;
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
    const permissions = await this.prismaService.permissionProfile.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        accessProfile: true,
        permission: true,
      },
    });

    return permissions;
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
    return this.permissionService.createPermissionProfile(model);
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
  }
}
