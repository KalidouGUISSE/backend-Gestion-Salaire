# Backend - Payroll Management System

## Description
Backend API for multi-company payroll management system built with Node.js, TypeScript, Express, Prisma, and MySQL.

## Features
- Multi-company support with role-based access control
- Employee management
- PayRun and Payslip generation
- Payment processing with PDF receipts
- Dashboard KPIs and analytics

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the values.

4. Set up database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up --build
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test
```bash
npm test -- PaymentRepository.test.ts
```

## API Documentation

Swagger UI available at: `http://localhost:3000/api-docs`

## Sample API Calls

### Create Employee
```bash
curl -X POST http://localhost:3000/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "contractType": "FIXE",
    "salary": 50000
  }'
```

### Create PayRun
```bash
curl -X POST http://localhost:3000/payruns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MONTHLY",
    "periodStart": "2023-01-01T00:00:00.000Z",
    "periodEnd": "2023-01-31T23:59:59.000Z"
  }'
```

### Generate Payslips
```bash
curl -X POST http://localhost:3000/payruns/1/generate-payslips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Record Payment
```bash
curl -X POST http://localhost:3000/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payslipId": 1,
    "amount": 4500,
    "method": "CASH"
  }'
```

## Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Environment Variables
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Environment (development/production)

## Project Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── validatorsSchema/
│   ├── middleware/
│   ├── utils/
│   └── prisma/
├── tests/
│   ├── unit/
│   └── integration/
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
└── package.json