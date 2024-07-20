import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/pipes.service';
import { CreateAuthDto, createAuthDto } from '../auth/dto/create-auth.dto';
import {
  CreateRegisterDto,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createRegisterDto,
  CreateVerifyCodeDto,
  createVerifyCodeDto,
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
        password: { type: 'boolean' },
      },
    },
  })
  create(
    @Body(new ZodValidationPipe(createAuthDto))
    createRegisterDto: CreateAuthDto,
  ) {
    return this.registerService.create(createRegisterDto);
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
}
