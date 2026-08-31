import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // 1. Check Bearer Token header first
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                // 2. Fallback to reading session_token cookie
                (req: Request) => req?.cookies?.['session_token'] || null,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
        });
    }

    async validate(payload: { sub: string; email: string }) {
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}