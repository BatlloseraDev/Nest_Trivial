import { IsString, IsInt, Min, IsPositive } from 'class-validator';

export class CreateUserDto {

    @IsInt()
    @IsPositive()
    id: number;

    @IsString()
    name: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString({ each: true })
    roles: string[];

}
