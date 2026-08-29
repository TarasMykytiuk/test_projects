import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
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
import { AuthResponseDto } from './dto/auth-response.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create user account' })
    @ApiCreatedResponse({ description: 'User successfully registered.', type: RegistrationDto })
    @ApiBadRequestResponse({ description: 'Input failed validation.' })
    @ApiConflictResponse({ description: 'Email already registered.' })
    register(@Body() dto: RegistrationDto) {
        return this.authService.registerUser(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in user and return access token' })
    @ApiOkResponse({ description: 'Login successful', type: AuthResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    login(@Body() dto: LoginDto) {
        return this.authService.loginUser(dto);
    }
}
