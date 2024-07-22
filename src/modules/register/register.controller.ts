import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/pipes.service';
import { CreateAuthDto, createAuthDto } from '../auth/dto/create-auth.dto';
import {
  CreateForgotPasswordDto,
  createForgotPasswordDto,
  CreateRegisterDto,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createRegisterDto,
  CreateResetPasswordDto,
  createResetPasswordDto,
  CreateVerifyCodeDto,
  createVerifyCodeDto,
  createVerifyEmaildDto,
  CreateVerifyEmaildDto,
} from './dto/create-register.dto';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('Auth')
@Controller('/api/v1/auth')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        image: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async create(
    @Body(new ZodValidationPipe(createAuthDto))
    createRegisterDto: CreateAuthDto,
  ) {
    const { message, token } =
      await this.registerService.create(createRegisterDto);

    await this.mailerService.sendMail({
      to: createRegisterDto.email,
      subject: 'no-reply',
      text: `${process.env.BASE_URL}?token=${token}`,
    });

    return { message };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(
    @Body(new ZodValidationPipe(createRegisterDto))
    createRegisterDto: CreateRegisterDto,
  ) {
    const { email, password } = createRegisterDto;

    const { code, message } = await this.registerService.login(email, password);

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: `Your code is ${code}`,
    });

    return { message };
  }

  @Post('verify-code')
  @ApiOperation({ summary: 'Verify code' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
    },
  })
  async verifyCode(
    @Body(new ZodValidationPipe(createVerifyCodeDto))
    createRegisterDto: CreateVerifyCodeDto,
  ) {
    const { code } = createRegisterDto;

    const verify = await this.registerService.verifyCode(code);

    await this.mailerService.sendMail({
      to: verify.email,
      subject: 'Bem-vindo',
      text: `<div style="background-color: white;">
      <h1>Seja bem-vindo</h1>
      <p>Seu token é: ${verify.token}</p>
      </div>`,
    });

    return { token: verify.token };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send email forgot password.' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async forgotPassword(
    @Body(new ZodValidationPipe(createForgotPasswordDto))
    body: CreateForgotPasswordDto,
  ) {
    const { email } = body;

    const { message, code } = await this.registerService.forgotPassword(email);

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: `<h1>Clique no link</h1><a href="${process.env.BASE_URL}?${code}">Alterar Senha</a>`,
    });

    return { message };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password.' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async resetPassword(
    @Body(new ZodValidationPipe(createResetPasswordDto))
    body: CreateResetPasswordDto,
  ) {
    const { token, password } = body;

    const { email, message } = await this.registerService.resetPassword(
      token,
      password,
    );

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: 'Password updated',
    });

    return { message };
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async verifyEmail(
    @Body(new ZodValidationPipe(createVerifyEmaildDto))
    body: CreateVerifyEmaildDto,
  ) {
    const { token } = body;

    const { email, message } = await this.registerService.verifyEmail(token);

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: 'Email verified',
    });

    return { message };
  }

  @Post('resend-email')
  @ApiOperation({ summary: 'Resend E-mail' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async resendEmail(
    @Body(new ZodValidationPipe(createForgotPasswordDto))
    body: CreateForgotPasswordDto,
  ) {
    const { email } = body;

    const { message, token } = await this.registerService.resendEmail(email);

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: `<h1>Clique no link</h1><a href="${process.env.BASE_URL}?${token}">verificar email</a>`,
    });

    return { message };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async logout(
    @Body(new ZodValidationPipe(createVerifyEmaildDto))
    body: CreateVerifyEmaildDto,
  ) {
    const { token } = body;

    const { message, email } = await this.registerService.logout(token);

    await this.mailerService.sendMail({
      to: email,
      subject: 'no-reply',
      text: 'Logout',
    });

    return { message };
  }

  @Post('session')
  @ApiOperation({ summary: 'Session' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async getSession(
    @Body(new ZodValidationPipe(createVerifyEmaildDto))
    body: CreateVerifyEmaildDto,
  ) {
    const { token } = body;

    const { user } = await this.registerService.getSession(token);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = user;

    return { user: newUser };
  }
}
