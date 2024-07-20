import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto } from './dto/update-auth.dto';
import { AuthRepository } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(private authRepo: AuthRepository) {}
  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepo.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepo.findMany();
  }

  async findMyProfile(id: string) {
    return await this.authRepo.findMyProfile(id);
  }

  async findOne(id: string) {
    return await this.authRepo.findOne(id);
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    return await this.authRepo.update(id, updateAuthDto);
  }

  async updatePassword(
    id: string,
    updateAuthPasswordDto: UpdateAuthPasswordDto,
  ) {
    return await this.authRepo.updatePassword(id, updateAuthPasswordDto);
  }

  async remove(id: string) {
    return await this.authRepo.delete(id);
  }
}
