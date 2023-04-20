import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../_models/prisma-class/user';

export class Paginated {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;
}

export class PaginatedUser extends Paginated {
  @ApiProperty({ isArray: true, type: () => User })
  data: User[];
}
