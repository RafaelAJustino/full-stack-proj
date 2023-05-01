import { PermissionProfile } from '@prisma/client';

export const permissionProfiles: Partial<PermissionProfile>[] = [
  {
    id: 1,
    permissionId: 1,
    accessProfileId: 1,
    create: true,
    update: true,
    read: true,
    delete: true,
  },
  {
    id: 2,
    permissionId: 2,
    accessProfileId: 1,
    create: true,
    update: true,
    read: true,
    delete: true,
  },
  {
    id: 3,
    permissionId: 3,
    accessProfileId: 1,
    create: true,
    update: true,
    read: true,
    delete: true,
  },
];
