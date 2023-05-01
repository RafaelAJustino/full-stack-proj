import { PrismaClient } from '@prisma/client';
import { generatePasswordToken } from '../src/helpers/auth.helper';
import { users } from './seeds/users';
import { permissions } from './seeds/permissions';
import { clients } from './seeds/client';
import { permissionProfiles } from './seeds/permissionProfile';
import { accessProfileUsers } from './accesProfileUser';
import { accessProfiles } from './accesProfile';

const prisma = new PrismaClient();

async function main() {
  console.group('Running seed script');
  console.time();

  const usersWithPw = await Promise.all(
    users.map(async (u) => ({
      ...u,
      email: u.email,
      password: await generatePasswordToken(u.password),
    })),
  );

  await prisma.user.createMany({
    data: usersWithPw,
    skipDuplicates: true,
  });

  const permission = await Promise.all(
    permissions.map(async (u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
    })),
  );

  await prisma.permission.createMany({
    data: permission,
    skipDuplicates: true,
  });

  const permissionProfile = await Promise.all(
    permissionProfiles.map(async (u) => ({
      id: u.id,
      permissionId: u.permissionId,
      accessProfileId: u.accessProfileId,
      create: u.create,
      update: u.update,
      read: u.read,
      delete: u.delete,
    })),
  );

  await prisma.permissionProfile.createMany({
    data: permissionProfile,
    skipDuplicates: true,
  });

  const acessProfile = await Promise.all(
    accessProfiles.map(async (u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
    })),
  );

  await prisma.accessProfile.createMany({
    data: acessProfile,
    skipDuplicates: true,
  });

  await prisma.permissionProfile.createMany({
    data: permissionProfile,
    skipDuplicates: true,
  });

  const accessProfileUser = await Promise.all(
    accessProfileUsers.map(async (u) => ({
      id: u.id,
      accessProfileId: u.accessProfileId,
      userId: u.userId,
    })),
  );

  await prisma.accessProfileUser.createMany({
    data: accessProfileUser,
    skipDuplicates: true,
  });

  const client = await Promise.all(
    clients.map(async (u) => ({
      id: u.id,
      name: u.name,
      contact: u.contact,
      document: u.document,
      state: u.state,
      zipCode: u.zipCode,
      city: u.city,
      address: u.address,
    })),
  );

  await prisma.client.createMany({
    data: client,
    skipDuplicates: true,
  });

  console.timeEnd();
  console.groupEnd();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
