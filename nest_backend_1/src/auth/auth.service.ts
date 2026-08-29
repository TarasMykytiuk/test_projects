import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrationDto } from './dto/registration.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }
    async registerUser(dto: RegistrationDto) {
        const name = dto.name.trim().toLowerCase();
        const email = dto.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
        const passwordHashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                passwordHashed,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
        return user
    }

    async loginUser(dto: LoginDto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHashed);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
        return {
            accessToken: accessToken
        };
    }
}
