import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrationDto } from './dto/registration.dto.js';
import { hashPassword, verifyPassword } from './helpers/hash-password.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dto/user-response.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';

// Pre-computed dummy argon2id hash to prevent timing attacks when email is missing
const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RkJ3OW1pY2Fsb2d5c2FsdHNhbHQ';
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }
    async registerUser(dto: RegistrationDto): Promise<UserResponseDto> {
        const name = dto.name.trim();
        const email = dto.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
        const passwordHashed = await hashPassword(dto.password);
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

    async loginUser(dto: LoginDto): Promise<AuthResponseDto> {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                passwordHashed: true
            }
        });

        // Use user's hash or a dummy hash to maintain constant execution time
        const targetHash = user ? user.passwordHashed : DUMMY_HASH;
        const isPasswordValid = await verifyPassword(targetHash, dto.password);

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        };
    }

    async getUserById(userId: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
        if (!user) {
            throw new UnauthorizedException('User not found!');
        }
        return user;
    }
}
