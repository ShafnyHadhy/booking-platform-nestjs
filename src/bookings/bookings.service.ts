import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {

    constructor(private prisma: PrismaService) {}

    async create(createBookingDto: CreateBookingDto) {

        const { serviceId, bookingDate, bookingTime } = createBookingDto;

        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });

        // should be existing service
        if (!service) {
            throw new NotFoundException(`Service with ID ${serviceId} not found`);
        }

        if (!service.isActive) {
            throw new BadRequestException(`Service with ID ${serviceId} is currently inactive`);
        }

        // cannot be past date
        const dateToCheck = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateToCheck < today) {
            throw new BadRequestException('Booking date cannot be in the past');
        }

        // prevent duplication
        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                serviceId,
                bookingDate: new Date(bookingDate),
                bookingTime,
                status: {
                    not: BookingStatus.CANCELLED
                }
            },
        });

        if (existingBooking) {
            throw new ConflictException('A booking already exists for this service at the requested date and time');
        }

        return this.prisma.booking.create({
            data: {
                ...createBookingDto,
                bookingDate: new Date(bookingDate),
            },
        });
    }
}
