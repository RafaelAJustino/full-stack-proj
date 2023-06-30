import { Body, Controller, Inject, Ip, Post, Put, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthLoginResponse, AuthRegisterResponse } from '../../../types/classes/auth.class';
import { HttpExceptionResponse } from '../../../types/classes/error.class';
import { LoginAuthDto, RegisterAuthDto, UpdatePasswordDto } from '../../../types/dtos/auth.dto';
import { API_VERSION_HEADER, API_VERSIONS } from '../../../utils/consts';
import { AuthService } from '../services/auth.service';
import { MonitoringService } from '../../monitoring/monitoring.service';

@ApiTags('Autenticação')
@ApiHeader({
  name: API_VERSION_HEADER,
  enum: API_VERSIONS,
  required: true,
})
@Controller({
  path: 'auth',
  version: API_VERSIONS,
})
@Throttle()
export class AuthController {
  constructor(
    @Inject(MonitoringService)
    private readonly monitoringService: MonitoringService,
    private authService: AuthService
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Cria um usuário',
  })
  @ApiCreatedResponse({
    description: 'O usuário foi criado com sucesso',
    type: AuthRegisterResponse,
  })
  @ApiBadRequestResponse({
    description: 'Já existe um usuário com o mesmo username',
    type: HttpExceptionResponse,
  })
  async register(@Body() model: RegisterAuthDto, @Ip() ip: string) {
    const result = await this.authService.register(model, ip);

    delete result.email;
    delete result.phone;
    delete result.deletedAt;
    delete result.id;

    this.monitoringService.log('ERRO no auth/register');

    return result;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Autentica um usuário',
  })
  @ApiOkResponse({
    description: 'Usuário autenticado com sucesso',
    type: AuthLoginResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Falha ao autenticar usuário',
    type: HttpExceptionResponse,
  })
  async login(@Body() model: LoginAuthDto, @Ip() ip: string): Promise<AuthLoginResponse> {
    const authUser = await this.authService.login(model);
    const token = await this.authService.createJwtToken(authUser, ip);
    // return { id: authUser.id, token };

    this.monitoringService.log('ERRO no auth/login');

    return { id: authUser.id, token, permission: authUser?.UserPermission?.permission || null };
  }

  @Put('update-password')
  @ApiOperation({
    summary: 'Atualiza a senha de um usuário',
  })
  @ApiOkResponse({
    description: 'Senha atualizada com sucesso',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({
    description: 'Falha ao autenticar usuário',
    type: HttpExceptionResponse,
  })
  @ApiBearerAuth()
  async updatePassword(@Req() req: Request, @Body() model: UpdatePasswordDto) {
    const result = await this.authService.updatePassword(model, req.user);

    this.monitoringService.log('ERRO no auth/update-password');

    return result;
  }
}
