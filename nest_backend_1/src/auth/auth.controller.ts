import { Controller, Post, HttpCode, HttpStatus, Body, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegistrationDto } from './dto/registration.dto.js';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create user account' })
    @ApiCreatedResponse({ description: 'User successfully registered.', type: UserResponseDto })
    @ApiBadRequestResponse({ description: 'Input failed validation.' })
    @ApiConflictResponse({ description: 'Email already registered.' })
    register(@Body() dto: RegistrationDto): Promise<UserResponseDto> {
        return this.authService.registerUser(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in user and return access token' })
    @ApiOkResponse({ description: 'Login successful', type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<UserResponseDto> {
        const { accessToken, user } = await this.authService.loginUser(dto);

        response.cookie('session_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 2,
            path: '/',
        });

        return user;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get info about yourself' })
    @ApiOkResponse({ description: 'Information returned', type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized / Missing or invalid token' })
    async getUserInfo(@CurrentUser('userId') userId: string): Promise<UserResponseDto> {
        return this.authService.getUserById(userId);
    }
}