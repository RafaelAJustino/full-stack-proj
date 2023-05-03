/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, Proposal } from '@prisma/client';
import ERRORS from '../../../utils/errors';
import { PrismaService } from '../../external/services/prisma.service';
import { ProposalDto } from '../../../types/dtos/proposal.dto';

@Injectable()
export class ProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(params: any): Promise<any> {
    return this.prisma.proposal.findUnique({
      ...params,
    });
  }

  async find(params: Prisma.ProposalFindManyArgs): Promise<Proposal[]> {
    const proposals = await this.prisma.proposal.findMany({
      ...params,
    });
    return proposals;
  }

  async count() {
    return this.prisma.proposal.count();
  }

  async create(data: Prisma.ProposalCreateInput, clientId: number): Promise<Proposal> {
    console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP', clientId);
    return this.prisma.proposal.create({
      data: {
        name: data.name,
        type: data.type,
        clientId: clientId,
      },
    });
  }

  async update(model: ProposalDto, clientId: number) {
    delete model.clientId;
    const existingUser = await this.find({
      where: {
        OR: [{ id: model.id }],
      },
    });

    if (existingUser.length > 1) {
      throw new HttpException(ERRORS.USER.EMAIL_OR_PHONE_USED, HttpStatus.BAD_REQUEST);
    }

    const user = existingUser[0];
    if (user && user.id !== clientId) {
      throw new HttpException(ERRORS.USER.EMAIL_OR_PHONE_USED, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.proposal.update({
      where: {
        id: model.id,
      },
      data: model,
    });
  }

  async delete(where: Prisma.ProposalWhereUniqueInput) {
    return this.prisma.proposal.delete({
      where,
    });
  }
}
