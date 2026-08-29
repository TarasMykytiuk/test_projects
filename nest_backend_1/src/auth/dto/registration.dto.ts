import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class RegistrationDto {
    @ApiProperty({
        example: 'Jane Doe',
        description: "Name of the user.",
    })
    @IsString()
    name!: string;
    @ApiProperty({
        example: 'test@example.com',
        description: 'A valid and unique email address',
    })
    @IsString()
    email!: string;

    @ApiProperty({
        example: '1234qwer!Q',
        description: 'Password',
    })
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).+$/,
        {
            message:
                'Password must include an uppercase letter, a lowercase letter, a number, and a special character.',
        },
    )
    password!: string;
}