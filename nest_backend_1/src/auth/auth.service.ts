import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrationDto } from './dto/registration.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
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
}
