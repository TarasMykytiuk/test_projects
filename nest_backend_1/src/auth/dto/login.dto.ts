import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'test@example.com'
    })
    @IsString()
    email!: string;
    @ApiProperty({
        example: '1234qwer!Q'
    })
    @IsString()
    @IsNotEmpty()
    password!: string;
}