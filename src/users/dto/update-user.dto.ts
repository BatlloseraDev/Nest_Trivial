import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsInt, Min, IsPositive, IsOptional } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsInt()
    @IsPositive()
    @IsOptional()
    id: number;

    @IsString()
    @IsOptional()
    name: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    age: number;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString({ each: true })
    @IsOptional()
    roles: string[];


}
