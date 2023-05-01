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
import { HttpExceptionResponse } from '../../../types/classes/error.class';
import { PaginatedUser } from '../../../types/classes/page.class';
import { PaginatedDto } from '../../../types/dtos/page.dto';
import { API_VERSIONS, API_VERSION_HEADER } from '../../../utils/consts';
import { PrismaService } from '../../external/services/prisma.service';
import { Roles } from '../../../roles/role.decorator';
import { RolePermission } from '../../../roles/rolePermission.enum';
import { RoleAction } from '../../../roles/roleAction.enum';
import { RolesGuard } from '../../../roles/role.guard';
import { ProposalService } from '../services/proposal.service';
import { ProposalDto } from '../../../types/dtos/proposal.dto';

@ApiTags('Propostas')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@Controller({
  path: 'proposal',
  version: API_VERSIONS,
})
@ApiUnauthorizedResponse({
  description: 'Usuário não autenticado',
  type: HttpExceptionResponse,
})
@Throttle()
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class PublicProposalController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalService: ProposalService,
  ) {}

  @Put('update')
  @ApiOperation({
    summary: 'Atualiza uma proposta',
  })
  @ApiOkResponse({
    description: 'Proposta atualizados com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Proposal, [RoleAction.UPDATE])
  async updateProposal(@Body() model: ProposalDto) {
    await this.proposalService.update(model, model.id);
  }

  @ApiOperation({
    summary: 'Busca lista de propostas',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Proposal, [RoleAction.READ])
  @Post('list')
  async getList(@Body() model: PaginatedDto) {
    const proposals = await this.prismaService.proposal.findMany({
      skip: (model.page - 1) * model.perPage,
      take: model.perPage,
      include: {
        client: true,
      },
      where: {
        OR: [
          {
            client: {
              name: {
                contains: model.search,
              },
            },
          },
          {
            client: {
              document: {
                contains: model.search,
              },
            },
          },
          {
            client: {
              contact: {
                contains: model.search,
              },
            },
          },
          {
            name: {
              contains: model.search,
            },
          },
        ],
      },
    });
    const countProposals = await this.proposalService.count();

    return {
      data: proposals,
      page: model.page,
      perPage: model.perPage,
      total: countProposals,
    };
  }

  @ApiOperation({
    summary: 'Busca uma proposta pelo id',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Proposal, [RoleAction.READ])
  @Get('list/:id')
  async getOneProposal(@Req() req: any) {
    const proposals = await this.proposalService.findOne({
      where: { id: parseInt(req.params.id) },
      include: {
        client: true,
      },
    });

    return proposals;
  }

  @ApiOperation({
    summary: 'Cria proposta',
  })
  @ApiOkResponse({
    description: '',
    type: PaginatedUser,
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui as permissões necessárias',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Proposal, [RoleAction.CREATE])
  @Post('create')
  async createUserProfile(@Body() model: ProposalDto) {
    return this.proposalService.create(model, model.clientId);
  }

  @Put('delete')
  @ApiOperation({
    summary: 'Deleta uma propostas',
  })
  @ApiOkResponse({
    description: 'Usuário deletado com sucesso',
  })
  @UseGuards(RolesGuard)
  // @Roles(rolePermission.Proposal, [RoleAction.DELETE])
  async delteProposal(@Body() model: any) {
    await this.proposalService.delete({ id: model.id });
  }
}
