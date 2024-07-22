/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto, UpdateAuthPasswordDto } from './dto/update-auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user-decorator';
import { TokenPayload } from './jwt.strategy';

@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({
    status: 200,
    description: 'The records been successfully created.',
  })
  @Get()
  @ApiBearerAuth()
  async findAll() {
    const user = await this.authService.findAll();

    const newUser = user.map((item) => {
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        image: item.image,
        emailVerified: item.emailVerified,
      };
    });

    return newUser;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one User by ID' })
  @ApiResponse({
    status: 200,
    description: 'The records been successfully created.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.authService.findOne(id);
    const { password, ...newUser } = user;

    return newUser;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile user authenticate.' })
  @ApiResponse({
    status: 200,
    description: 'The records been successfully created.',
  })
  @Get('profile/me')
  async profileMe(@CurrentUser() user: TokenPayload) {
    const userProfile = await this.authService.findMyProfile(user.sub);
    const { password, ...newUser } = userProfile;

    return { user: newUser };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Users by ID' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        image: { type: 'string' },
      },
    },
  })
  @Put(':id/update')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.update(id, updateAuthDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password User' })
  @ApiResponse({
    status: 201,
    description: 'The records been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @Put(':id/password/update')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateAuthPasswordDto: UpdateAuthPasswordDto,
  ) {
    return await this.authService.updatePassword(id, updateAuthPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiResponse({
    status: 204,
    description: 'The records been successfully created.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authService.remove(id);
  }
}
