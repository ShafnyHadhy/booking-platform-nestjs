# Booking Platform REST API

## Project Overview

A NestJS backend REST API for a Booking Platform that provides user authentication, service management (CRUD), and customer booking lifecycle management (create, view, update status, cancel).

## Technologies Used

- **Framework:** NestJS
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma v6
- **Authentication:** JWT (JSON Web Tokens) with Passport

## Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
## Environment Variables

Copy the example environment file and configure it:
```bash
cp .env.example .env
```
Ensure `.env` contains:
- `NODE_ENV=development`
- `PORT=8001`
- `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_platform?schema=public"`
- `JWT_SECRET="your-dev-secret"`
- `JWT_EXPIRES_IN="604800"`

## Database Setup

This project uses Docker to run a local PostgreSQL instance.

1. Start the database:
   ```bash
   docker compose up -d
   ```
2. The database will be available on `localhost:5432`.

## Running Migrations

To apply database schema changes and generate the Prisma Client, run:
```bash
npm run migrate:dev
```
*(For production deployments, use `npm run migrate:deploy`)*

## Running the Application

```bash
# development
npm run start
# watch mode
npm run start:dev
```
## API Documentation

API documentation is provided as a Postman collection.
You can import the `Booking-Platform-API.postman_collection.json` file found in the root of this repository into Postman.

It includes folders for:
- **Auth**: Register and Login (Login automatically sets the `{{token}}` variable).
- **Services**: CRUD operations for services (Requires Auth).
- **Bookings**: Create booking (Public), and manage bookings (Requires Auth).

## Assumptions Made

- ***Update Booking Status**: Cannot change the COMPLETED bookings and cannot change status of a cancelled booking.
- **Service Pagination**: Pagination was not explicitly required for `GET /services`, so it has been omitted to keep the implementation simple.
- **Cancel Booking Endpoint**: Implemented as `PATCH /bookings/:id/cancel` which acts as an alias to update the status to `CANCELLED`.

## Future Improvements

- Add comprehensive Unit and E2E Testing using Jest.
- Implement Refresh Tokens for better security and session management.
- Add pagination and advanced filtering to the Services endpoint.
- Integrate Swagger for auto-generated interactive API documentation.
- Setup CI/CD pipelines using GitHub Actions.
