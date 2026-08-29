import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

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
    @IsEmail({}, { message: 'Must be a valid email address.' })
    @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
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