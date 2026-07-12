import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @Min(1)
    duration: number;
    
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}