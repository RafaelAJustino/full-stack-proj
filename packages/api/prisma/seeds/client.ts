import { Client } from '@prisma/client';

export const clients: Partial<Client>[] = [
  {
    id: 1,
    name: 'USER',
    contact: '01234567890',
    document: '01345689012',
    state: 'PR',
    zipCode: '012345678',
    city: 'Cornélio Procópio',
    address: 'R.Teste | 00 | Vila Teste',
  },
];
