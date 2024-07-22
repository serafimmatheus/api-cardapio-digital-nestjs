import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterRepository } from './entities/register.entity';

interface Props {
  message: string;
  code: string;
}

@Injectable()
export class RegisterService {
  constructor(private registerRepo: RegisterRepository) {}
  async create(createRegisterDto: CreateRegisterDto) {
    return await this.registerRepo.create(createRegisterDto);
  }

  async login(email: string, password: string): Promise<Props> {
    return await this.registerRepo.authenticate(email, password);
  }

  async verifyCode(code: string) {
    return await this.registerRepo.verifyCode(code);
  }

  async forgotPassword(email: string) {
    return await this.registerRepo.forgotPassword(email);
  }

  async resetPassword(token: string, password: string) {
    return await this.registerRepo.resetPassword(token, password);
  }

  async verifyEmail(token: string) {
    return await this.registerRepo.verifyEmail(token);
  }
  async resendEmail(email: string) {
    return await this.registerRepo.resendEmail(email);
  }

  async logout(token: string) {
    return await this.registerRepo.logout(token);
  }

  async getSession(token: string) {
    return await this.registerRepo.getSession(token);
  }
}
