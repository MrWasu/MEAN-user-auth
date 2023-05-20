import { IsEmail, IsString, MinLength } from 'class-validator'; //! apuntes 5

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}
