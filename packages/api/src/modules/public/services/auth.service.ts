import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { LoginAuthDto, RegisterAuthDto, UpdatePasswordDto } from '../../../types/dtos/auth.dto';
import { DecodedJWT } from '../../../types/interfaces/jwt.interface';
import ERRORS from '../../../utils/errors';
import { AESHelper } from '../../../helpers/aes.helper';
import { PrismaService } from '../../external/services/prisma.service';
import { generatePasswordToken } from '../../../helpers/auth.helper';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  private aesHelper = new AESHelper();
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(model: RegisterAuthDto, ip: string) {
    const existingUser = await this.userService.findOne({
      where: { email: model.email },
    });

    if (existingUser) {
      throw new HttpException(ERRORS.AUTH.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const encryptedPw = await generatePasswordToken(model.password);

    const saved = await this.userService.create({
      email: model.email.toLowerCase(),
      password: encryptedPw,
      profile: {
        create: {
          firstName: model.firstName,
          lastName: model.lastName,
        },
      },
    });

    const token = await this.createJwtToken(saved, ip);

    delete saved.password;
    return { ...saved, token };
  }

  async login(model: LoginAuthDto) {
    const user = await this.userService.findOne({
      where: { email: model.email },
      include: {
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

    console.log(user);

    const exception = new HttpException(ERRORS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    if (!user) {
      throw exception;
    }

    if (!user?.isActive) {
      throw new HttpException(ERRORS.AUTH.INVALID_ACCESS, HttpStatus.UNAUTHORIZED);
    }

    const decryptedPw = await this.aesHelper.decrypt(user.password);

    console.log({ decryptedPw }, user.password);

    const grantAccess = await bcrypt.compare(model.password, decryptedPw);
    if (!grantAccess) {
      throw exception;
    }

    // if (!user.isActive) return null;
    if (user) return user;
    return null;
  }

  async updatePassword(model: UpdatePasswordDto, user: Partial<User>) {
    const auth = await this.login({
      email: user.email,
      password: model.password,
    });

    if (!auth) throw new HttpException(ERRORS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const encryptedPw = await generatePasswordToken(model.newPassword);

    const res = await this.prismaService.user.update({
      where: {
        id: auth.id,
      },
      data: {
        password: encryptedPw,
      },
    });

    return !!res;
  }

  async verifyAccess(decodedToken: DecodedJWT) {
    const user = await this.userService.findOne({
      where: {
        email: decodedToken.email,
      },
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

    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', user);
    if (!user?.isActive) return null;
    if (user) return user;
    return null;
  }

  async createJwtToken(model: User, ip: string) {
    const key = await this.configService.get('JWT_KEY');
    const token = await jwt.sign(
      {
        ip,
        email: model.email,
      },
      key,
      {
        expiresIn: '7d',
      },
    );

    return token;
  }

  async decodeJwtToken(token: string): Promise<DecodedJWT> {
    const key = await this.configService.get('JWT_KEY');
    return jwt.verify(token, key) as DecodedJWT;
  }
}
