import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier for the user',
    })
    id!: string;

    @ApiProperty({
        example: 'Jane Doe',
        description: 'Name of the user',
    })
    name!: string;

    @ApiProperty({
        example: 'test@example.com',
        description: 'Email address of the user',
    })
    email!: string;

    @ApiProperty({
        example: '2026-08-29T15:00:00.000Z',
        description: 'Timestamp when the user account was created',
    })
    createdAt!: Date;
}