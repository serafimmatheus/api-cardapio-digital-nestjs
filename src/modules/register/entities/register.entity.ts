import { CreateAuthDto } from '@/modules/auth/dto/create-auth.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { compareDates } from '@/utils/compare-dates';
import { generateRandomNumbers } from '@/utils/generate-code';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

interface Props {
  message: string;
  code: string;
}

interface RegisterRepositoryProps {
  create(data: CreateAuthDto): Promise<{ message: string }>;
  authenticate(email: string, password: string): Promise<object>;
}

@Injectable()
export class RegisterRepository implements RegisterRepositoryProps {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await hash(data.password, 8);

    const userCreate = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
        password: passwordHash,
      },
    });

    const code = generateRandomNumbers();

    await this.prisma.token.create({
      data: {
        code,
        type: 'EMAIL_CONFIRMATION',
        userId: userCreate.id,
      },
    });

    const token = this.jwtService.sign(
      { sub: code },
      { secret: process.env.JWT_SECRET, expiresIn: '5m' },
    );

    return { message: 'User created successfully', token };
  }

  async authenticate(email: string, password: string): Promise<Props> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User or password incorrect');
    }

    if (!user.emailVerified) {
      throw new BadRequestException('Email not verified');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('User or password incorrect');
    }

    const code = generateRandomNumbers();

    await this.prisma.token.create({
      data: {
        code,
        userId: user.id,
        type: 'AUTHENTICATE_WITH_PASSWORD',
      },
    });

    return { message: 'Code sent to email', code };
  }

  async verifyCode(code: string) {
    const token = await this.prisma.token.findFirst({
      where: {
        code,
        type: 'AUTHENTICATE_WITH_PASSWORD',
      },
    });

    if (!token) {
      throw new BadRequestException('Code invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: token.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Code invalid');
    }

    const compareDatesFn = compareDates(token.createdAt, new Date());

    if (!compareDatesFn) {
      await this.prisma.token.delete({
        where: {
          id: token.id,
        },
      });

      throw new BadRequestException('Code expired');
    }

    const tokenConfirm = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    await this.prisma.token.delete({
      where: {
        id: token.id,
      },
    });

    const sessionAlreadyExists = await this.prisma.session.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (sessionAlreadyExists) {
      await this.prisma.session.delete({
        where: {
          id: sessionAlreadyExists.id,
        },
      });
    }

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: tokenConfirm,
        expires: new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000),
      },
    });

    return { token: tokenConfirm, email: user.email };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { message: 'Code sent to email' };
    }

    const code = generateRandomNumbers();

    await this.prisma.token.create({
      data: {
        code,
        userId: user.id,
        type: 'PASSWORD_RECOVER',
      },
    });

    const tokenCode = this.jwtService.sign(
      { sub: code },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    return { message: 'Code sent to email', code: tokenCode };
  }

  async resetPassword(token: string, password: string) {
    const { sub } = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    const tokenDb = await this.prisma.token.findFirst({
      where: {
        code: sub,
        type: 'PASSWORD_RECOVER',
      },
    });

    if (!tokenDb) {
      throw new BadRequestException('Code invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: tokenDb.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Code invalid');
    }

    const compareDatesFn = compareDates(tokenDb.createdAt, new Date());

    if (!compareDatesFn) {
      await this.prisma.token.delete({
        where: {
          id: tokenDb.id,
        },
      });

      throw new BadRequestException('Code expired');
    }

    const passwordHash = await hash(password, 8);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
      },
    });

    await this.prisma.token.delete({
      where: {
        id: tokenDb.id,
      },
    });

    return { message: 'Password updated successfully', email: user.email };
  }

  async verifyEmail(token: string) {
    const { sub } = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    const tokenDb = await this.prisma.token.findFirst({
      where: {
        code: sub,
        type: 'EMAIL_CONFIRMATION',
      },
    });

    if (!tokenDb) {
      throw new BadRequestException('Code invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: tokenDb.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Code invalid');
    }

    const compareDatesFn = compareDates(tokenDb.createdAt, new Date());

    if (!compareDatesFn) {
      await this.prisma.token.delete({
        where: {
          id: tokenDb.id,
        },
      });

      throw new BadRequestException('Code expired');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await this.prisma.token.delete({
      where: {
        id: tokenDb.id,
      },
    });

    return { message: 'Email verified successfully', email: user.email };
  }

  async resendEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: 'EMAIL_CONFIRMATION',
      },
    });

    const code = generateRandomNumbers();

    await this.prisma.token.create({
      data: {
        code,
        type: 'EMAIL_CONFIRMATION',
        userId: user.id,
      },
    });

    const token = this.jwtService.sign(
      { sub: code },
      { secret: process.env.JWT_SECRET, expiresIn: '5m' },
    );

    return { message: 'Code sent to email', token };
  }

  async logout(token: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        sessionToken: token,
      },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    return { message: 'Logout successfully', email: user.email };
  }

  async getSession(token: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        sessionToken: token,
      },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return { user };
  }
}
