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
}
