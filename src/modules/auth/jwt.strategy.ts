import z from 'zod';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Env } from '@/env';

const tokenPayloadSchema = z.object({
  sub: z.string().cuid(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
