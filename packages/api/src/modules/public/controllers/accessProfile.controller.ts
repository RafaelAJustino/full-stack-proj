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
import { HttpExceptionResponse } from '../../../types/classes/error.class';
import { PaginatedDto } from '../../../types/dtos/page.dto';
import { API_VERSIONS, API_VERSION_HEADER } from '../../../utils/consts';
import { PrismaService } from '../../external/services/prisma.service';
import { AccessProfileService } from '../services/accessProfile.service';
import { RolesGuard } from '../../../roles/role.guard';
import { RolePermission } from '../../../roles/rolePermission.enum';
import { Roles } from '../../../roles/role.decorator';
import { RoleAction } from '../../../roles/roleAction.enum';
import { MonitoringService } from '../../monitoring/monitoring.service';

@ApiTags('Permissão')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@Controller({
  path: 'access-profile',
  version: API_VERSIONS,
})
@ApiUnauthorizedResponse({
  description: 'Usuário não autenticado',
  type: HttpExceptionResponse,
})
@Throttle()
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class AccessProfileController {
  constructor(
    @Inject(MonitoringService)
    private readonly monitoringService: MonitoringService,
    private readonly prismaService: PrismaService,
    private readonly accesProfileService: AccessProfileService,
  ) {}

  @ApiOperation({
    summary: 'lista todos os perfis',
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
    const permissions = await this.prismaService.accessProfile.findMany({
      include: {
        permissionProfile: {
          include: {
            permission: true,
          },
        },
        accessProfileUser: {
          include: {
            user: true,
          },
        },
      },
    });

    this.monitoringService.log('ERRO no access-profile/list-all');

    return permissions;
  }

  @ApiOperation({
    summary: 'lista perfis de acesso',
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
    const permissions = await this.prismaService.accessProfile.findMany({
      skip: (model.page - 1) * model.perPage,
      take: model.perPage,
      where: {
        name: {
          contains: model.search,
        },
      },
      include: {
        permissionProfile: {
          include: {
            permission: true,
          },
        },
        accessProfileUser: {
          include: {
            user: true,
          },
        },
      },
    });
    const countPermissions = await this.accesProfileService.count();

    this.monitoringService.log('ERRO no access-profile/list');

    return {
      data: permissions,
      page: model.page,
      perPage: model.perPage,
      total: countPermissions,
    };
  }

  @ApiOperation({
    summary: 'Busca um perfil de acesso pelo id',
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
    const permissions = await this.prismaService.accessProfile.findUnique({
      include: {
        permissionProfile: {
          include: {
            permission: true,
          },
        },
        accessProfileUser: {
          include: {
            user: true,
          },
        },
      },
      where: {
        id: parseInt(id),
      },
    });

    this.monitoringService.log('ERRO no access-profile/list/:id');

    return permissions;
  }

  @ApiOperation({
    summary: 'traz o total de perfis de acesso',
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
    const users = await this.accesProfileService.count();

    this.monitoringService.log('ERRO no access-profile/count');

    return users;
  }

  @ApiOperation({
    summary: 'Cria um perfil de acesso',
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
    const data = this.accesProfileService.createAccessProfile(model);

    this.monitoringService.log('ERRO no access-profile/create');

    return data;
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualiza um perfil de acesso',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.UPDATE])
  async updatePermission(@Body() model: any) {
    await this.accesProfileService.updateAccessProfile(model);

    this.monitoringService.log('ERRO no access-profile/update');
  }

  @Put('delete')
  @ApiOperation({
    summary: 'Deleta um perfil de acesso',
  })
  @ApiOkResponse({
    description: 'Permissão deletada com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Permission, [RoleAction.DELETE])
  async deletePermission(@Body() model: any) {
    await this.accesProfileService.deleteAccessProfile({ id: model.id });

    this.monitoringService.log('ERRO no access-profile/delete');
  }
}
