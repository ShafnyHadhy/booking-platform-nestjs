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

    async findAll(status?: BookingStatus) {

        const where = status ? { status } : {};

        return this.prisma.booking.findMany({
            where,
            orderBy: [
                { bookingDate: 'desc' },
                { bookingTime: 'desc' },
            ],
            include: {
                service: true
            }
        });
    }

    async findOne(id: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                service: true
            }
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    async updateStatus(id: string, newStatus: BookingStatus) {

        const booking = await this.findOne(id);

        if (booking.status === BookingStatus.CANCELLED && newStatus === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cannot transition a cancelled booking to completed');
        }

        if (booking.status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cannot change status of a completed booking');
        }
        
        if (booking.status === BookingStatus.CANCELLED && newStatus !== BookingStatus.CANCELLED) {
            throw new BadRequestException('Cannot change status of a cancelled booking');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: newStatus },
        });
    }

    async cancel(id: string) {
        return this.updateStatus(id, BookingStatus.CANCELLED);
    }
}
