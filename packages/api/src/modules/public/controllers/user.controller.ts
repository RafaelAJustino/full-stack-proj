/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, Post, Req, UseGuards, Put, Inject } from '@nestjs/common';
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
import { PaginatedUser } from '../../../types/classes/page.class';
import { PaginatedDto } from '../../../types/dtos/page.dto';
import { UpdateUserDto } from '../../../types/dtos/user.dto';
import { UpdateUserProfileDto } from '../../../types/dtos/userProfile.dto';
import { API_VERSIONS, API_VERSION_HEADER } from '../../../utils/consts';
import { User } from '../../../_models/prisma-class/user';
import { PrismaService } from '../../external/services/prisma.service';
import { UserService } from '../services/user.service';
import { Roles } from '../../../roles/role.decorator';
import { RolePermission } from '../../../roles/rolePermission.enum';
import { RoleAction } from '../../../roles/roleAction.enum';
import { RolesGuard } from '../../../roles/role.guard';
import { RedisService } from '../../../config/redis';
import { MonitoringService } from '../../monitoring/monitoring.service';

@ApiTags('Usuário')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@Controller({
  path: 'user',
  version: API_VERSIONS,
})
@ApiUnauthorizedResponse({
  description: 'Usuário não autenticado',
  type: HttpExceptionResponse,
})
@Throttle()
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class PublicUserController {
  constructor(
    @Inject(MonitoringService)
    private readonly monitoringService: MonitoringService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly redis: RedisService,
  ) {}

  @ApiOperation({
    summary: 'Busca os dados do usuário autenticado via JWT',
  })
  @ApiOkResponse({
    description: '',
    type: User,
  })
  @Get('me')
  getMet(@Req() req: Request) {
    const data = req.user;

    this.monitoringService.log('ERRO no user/me');

    return data;
  }

  @ApiOperation({
    summary: 'Cria perfil de usuário',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.CREATE])
  @Post('create')
  async createUserProfile(@Body() model: UpdateUserProfileDto) {
    const data = this.userService.createProfile(model);

    this.monitoringService.log('ERRO no user/create');

    return data;
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualiza dados pessoais de um usuário',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.UPDATE])
  async updateUser(@Body() model: UpdateUserDto) {
    await this.redis.del(`user/${model.id}`);
    await this.userService.update(model, model.id);

    this.monitoringService.log('ERRO no user/update');
  }

  @Put('update/status')
  @ApiOperation({
    summary: 'Atualiza dados pessoais de um usuário',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.UPDATE])
  async updateUserStatus(@Body() model: UpdateUserDto) {
    await this.redis.del(`user/${model.id}`);
    await this.userService.updateStatus(model, model.id);

    this.monitoringService.log('ERRO no user/update-status');
  }

  @ApiOperation({
    summary: 'Busca lista de usuários',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.READ])
  @Post('list')
  async getList(@Body() model: PaginatedDto) {
    const cachedUser = await this.redis.get(`user/list`);

    if (!cachedUser) {
      const users = await this.prismaService.user.findMany({
        skip: (model.page - 1) * model.perPage,
        take: model.perPage,
        include: {
          profile: true,
        },
        where: {
          OR: [
            {
              profile: {
                firstName: {
                  contains: model.search,
                },
              },
            },
            {
              profile: {
                lastName: {
                  contains: model.search,
                },
              },
            },
            {
              email: {
                contains: model.search,
              },
            },
          ],
        },
      });
      const countUser = await this.userService.count();

      this.monitoringService.log('ERRO no user/list');

      await this.redis.set(
        `user/list`,
        JSON.stringify({
          data: users,
          page: model.page,
          perPage: model.perPage,
          total: countUser,
        }),
      );

      return {
        data: users,
        page: model.page,
        perPage: model.perPage,
        total: countUser,
      };
    }
    return JSON.parse(cachedUser);
  }

  @ApiOperation({
    summary: 'Busca um usuário pelo id',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.READ])
  @Get('list/:id')
  async getOneProfile(@Req() req: any) {
    const cachedUser = await this.redis.get(`user/${req.params.id}`);

    if (!cachedUser) {
      const user = await this.userService.findOne({
        where: { id: parseInt(req.params.id) },
        include: {
          profile: true,
          accessProfileUser: {
            include: {
              accessProfile: {
                include: {
                  permissionProfile: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      delete user.password;
      delete user.UserPermission;

      await this.redis.set(`user/${req.params.id}`, JSON.stringify(user));

      this.monitoringService.log('ERRO no user/list/:id');

      return user;
    }

    return JSON.parse(cachedUser);
  }

  @Put('delete')
  @ApiOperation({
    summary: 'Deleta um usuário',
  })
  @ApiOkResponse({
    description: 'Usuário deletado com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.User, [RoleAction.DELETE])
  async delteUser(@Body() model: any) {
    await this.redis.del(`user/${model.id}`);
    await this.userService.delete({ id: model.id }, model.id);

    this.monitoringService.log('ERRO no user/delete');
  }
}
