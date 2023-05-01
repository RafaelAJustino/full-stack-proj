import { Permission } from '@prisma/client';

export const permissions: Partial<Permission>[] = [
  {
    id: 1,
    name: 'USER',
    description: 'acesso aos usuários',
  },
  {
    id: 2,
    name: 'PERMISSION',
    description: 'acesso as permissões',
  },
  {
    id: 3,
    name: 'PROPOSAL',
    description: 'acesso as propostas',
  },
];
