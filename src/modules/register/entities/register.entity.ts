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

    await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
        password: passwordHash,
      },
    });

    return { message: 'User created successfully' };
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

    return { token: tokenConfirm, email: user.email };
  }
}
