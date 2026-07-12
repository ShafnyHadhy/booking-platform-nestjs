import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingStatus } from '@prisma/client';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('status') status?: BookingStatus) {
        return this.bookingsService.findAll(status);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

}
