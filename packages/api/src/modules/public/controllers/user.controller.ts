/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, Post, Req, UseGuards, Put } from '@nestjs/common';
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
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
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
    return req.user;
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
  @Roles(RolePermission.User, [RoleAction.CREATE])
  @Post('create')
  async createUserProfile(@Body() model: UpdateUserProfileDto) {
    return this.userService.createProfile(model);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualiza dados pessoais de um usuário',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  @Roles(RolePermission.User, [RoleAction.UPDATE])
  async updateUser(@Body() model: UpdateUserDto) {
    await this.userService.update(model, model.id);
  }

  @Put('update/status')
  @ApiOperation({
    summary: 'Atualiza dados pessoais de um usuário',
  })
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  @Roles(RolePermission.User, [RoleAction.UPDATE])
  async updateUserStatus(@Body() model: UpdateUserDto) {
    await this.userService.updateStatus(model, model.id);
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
  @Roles(RolePermission.User, [RoleAction.READ])
  @Post('list')
  async getList(@Body() model: PaginatedDto) {
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

    return {
      data: users,
      page: model.page,
      perPage: model.perPage,
      total: countUser,
    };
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
  @Roles(RolePermission.User, [RoleAction.READ])
  @Get('list/:id')
  async getOneProfile(@Req() req: any) {
    const users = await this.userService.findOne({
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

    delete users.password;
    delete users.UserPermission;

    return users;
  }

  @Put('delete')
  @ApiOperation({
    summary: 'Deleta um usuário',
  })
  @ApiOkResponse({
    description: 'Usuário deletado com sucesso',
  })
  @UseGuards(RolesGuard)
  @Roles(RolePermission.User, [RoleAction.DELETE])
  async delteUser(@Body() model: any) {
    await this.userService.delete({ id: model.id }, model.id);
  }
}
