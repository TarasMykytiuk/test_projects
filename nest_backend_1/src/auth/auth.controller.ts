import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegistrationDto } from './dto/registration.dto.js';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create user account'
    })
    @ApiCreatedResponse({
        description: 'User successfully registered.',
        type: RegistrationDto
    })
    @ApiBadRequestResponse({
        description: 'Input failed validation.',
    })
    @ApiConflictResponse({
        description: 'Email already registered.',
    })
    register(@Body() dto: RegistrationDto) {
        return this.authService.registerUser(dto);
    }
}
