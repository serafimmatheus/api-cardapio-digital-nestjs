import { PrismaService } from '@/modules/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto } from '../dto/update-auth.dto';
import { compare, hash } from 'bcryptjs';
import { User } from '@prisma/client';

interface AuthRepositoryProps {
  findMany(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findMyProfile(id: string): Promise<User>;
  create(data: CreateAuthDto): Promise<{
    message: string;
  }>;
  update(
    id: string,
    data: UpdateAuthDto,
  ): Promise<{
    message: string;
  }>;
  updatePassword(
    id: string,
    data: UpdateAuthPasswordDto,
  ): Promise<{
    message: string;
  }>;
  delete(id: string): Promise<{
    message: string;
  }>;
}

@Injectable()
export class AuthRepository implements AuthRepositoryProps {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findMyProfile(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user;
  }

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

  async update(id: string, data: UpdateAuthDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
      },
    });

    return { message: 'User updated successfully' };
  }

  async updatePassword(id: string, data: UpdateAuthPasswordDto) {
    const { newPassword, oldPassword } = data;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ConflictException('Password is incorrect');
    }

    const isPasswordMatch = await compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw new ConflictException('Password is incorrect');
    }

    const newPasswordHash = await hash(newPassword, 8);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPasswordHash,
      },
    });

    return { message: 'Password updated successfully' };
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
