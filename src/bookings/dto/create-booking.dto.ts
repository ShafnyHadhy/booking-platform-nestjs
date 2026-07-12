import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  bookingDate: string;

  @IsString()
  @IsNotEmpty()
  bookingTime: string;

  @IsString()
  @IsOptional()
  notes?: string;
}