import { IsString, IsInt, Min, IsPositive, IsArray } from 'class-validator';

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

    @IsInt()
    @IsPositive()
    score: number;

    @IsInt()
    @IsPositive()
    answeredCount: number;


    @IsArray()
    @IsString({ each: true })
    roles: string[];

    

}
