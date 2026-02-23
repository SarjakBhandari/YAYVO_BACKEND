# YAYVO Backend - Project Overview & Architecture

## Project Summary

**YAYVO Backend** is a Node.js/Express-based REST API backend for an e-commerce platform. It manages consumers, retailers, products, reviews, and collections with comprehensive authentication, authorization, and file upload capabilities.

**Author:** Sarjak Bhandari  
**CoventryId:** 14811977
**Batch:**35 
**Section**:B

---

##  Architecture Overview

### Architecture Pattern: **Layered Architecture (3-Tier)**

The application follows a clean, maintainable layered architecture:

```
Request → Routes → Controllers → Services → Repositories → Models → Database
         ↑                                                              ↓
         └──────────────── Error Handler ←───────────────────────────┘
```

### Layers:

1. **Routes Layer** (`/routes`)
   - Express route definitions
   - HTTP verb mappings
   - Route parameter handling

2. **Controller Layer** (`/controller`)
   - Request validation (using DTOs)
   - Request/Response handling
   - Error propagation to middleware

3. **Service Layer** (`/services`)
   - Business logic implementation
   - Data transformation
   - Cross-service interactions

4. **Repository Layer** (`/repository`)
   - Data access abstraction
   - Database operations
   - Query building

5. **Model Layer** (`/models`)
   - MongoDB schema definitions
   - Data validation rules
   - Mongoose models

6. **Middleware Layer** (`/middlewares`)
   - Authentication/Authorization
   - File upload handling
   - Request validation
   - CORS handling

---

## Technology Stack

### Core Framework
- **Express.js** v5.2.1 - Web server framework
- **Node.js** - Runtime environment
- **TypeScript** v5.9.3 - Type-safe JavaScript

### Database
- **MongoDB** - NoSQL database
- **Mongoose** v9.1.1 - ODM (Object Data Modeling)
- **mongodb-memory-server** - In-memory MongoDB for testing

### Authentication & Security
- **JWT (jsonwebtoken)** v9.0.3 - Token-based authentication
- **bcryptjs** v3.0.3 - Password hashing
- **bcrypt** v6.0.0 - Password encryption

### File Handling
- **Multer** v2.0.2 - Middleware for file uploads
- **fs-extra** v11.3.3 - File system operations

### Validation & Data
- **Zod** v4.3.4 - Schema validation
- **class-validator** v0.14.3 - Decorator-based validation

### API & Communication
- **CORS** v2.8.5 - Cross-Origin Resource Sharing
- **express-rate-limit** v8.2.1 - Rate limiting
- **Nodemailer** v8.0.1 - Email sending

### Testing
- **Jest** v30.2.0 - Testing framework
- **Supertest** v7.2.2 - HTTP assertion library
- **jest-mock-extended** v4.0.0 - Mock utilities
- **ts-jest** v29.4.6 - TypeScript Jest integration

### Development Tools
- **Nodemon** - File watcher for auto-restart
- **ts-node** - TypeScript execution
- **ts-node-dev** - Enhanced ts-node with watch mode

---

##  Project Structure

```
YAYVO_BACKEND/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Server entry point
│   │
│   ├── config/
│   │   ├── index.ts           # Environment config & constants
│   │   ├── email.ts           # Email configuration
│   │   └── __tests__/
│   │
│   ├── controller/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── consumer.controller.ts
│   │   ├── retailer.controller.ts
│   │   ├── product.controller.ts
│   │   ├── review.controller.ts
│   │   └── collection.controller.ts
│   │
│   ├── services/              # Business logic
│   │   ├── auth.service.ts
│   │   ├── consumer.service.ts
│   │   ├── retailer.service.ts
│   │   ├── product.service.ts
│   │   ├── review.service.ts
│   │   └── collection.service.ts
│   │
│   ├── repository/            # Data access layer
│   │   ├── user.repository.ts
│   │   ├── consumer.repository.ts
│   │   ├── retailer.repository.ts
│   │   ├── product.repository.ts
│   │   ├── review.repository.ts
│   │   ├── collection.repository.ts
│   │   └── interfaces/        # Repository interfaces
│   │
│   ├── routes/                # API endpoints
│   │   ├── auth.route.ts
│   │   ├── consumer.route.ts
│   │   ├── retailer.route.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   ├── collection.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── models/                # MongoDB schemas
│   │   ├── user.model.ts
│   │   ├── consumer.model.ts
│   │   ├── retailer.model.ts
│   │   ├── product.model.ts
│   │   ├── review.model.ts
│   │   └── collection.model.ts
│   │
│   ├── dtos/                  # Data Transfer Objects (Zod schemas)
│   │   ├── auth.dtos.ts
│   │   ├── consumer.dtos.ts
│   │   ├── retailer.dtos.ts
│   │   ├── product.dtos.ts
│   │   ├── review.dtos.ts
│   │   └── collection.dtos.ts
│   │
│   ├── middlewares/           # Express middleware
│   │   ├── authorized.middleware.ts      # Auth guard
│   │   ├── upload.middleware.ts          # Generic upload
│   │   ├── product_upload.middleware.ts  # Product-specific upload
│   │   ├── review_upload.middleware.ts   # Review-specific upload
│   │   └── validateCollections.middleware.ts
│   │
│   ├── database/
│   │   └── mongodb.ts         # MongoDB connection setup
│   │
│   ├── errors/
│   │   └── http.error.ts      # Custom HTTP error class
│   │
│   ├── types/
│   │   └── query.type.ts      # Query type definitions
│   │
│   ├── utils/
│   │   └── queryParser.ts     # Query string parsing utility
│   │
│   └── __tests__/             # Unit & Integration tests
│       ├── app.test.ts
│       ├── setup.ts
│       ├── __mocks__/         # Mock implementations
│       └── integration/       # Integration tests
│           ├── auth.integration.test.ts
│           ├── collection.integration.test.ts
│           ├── consumer.integration.test.ts
│           ├── product.integration.test.ts
│           ├── retailer.integration.test.ts
│           ├── review.integration.test.ts
│           └── fixtures/
│
├── uploads/                   # File storage
│   ├── products/
│   ├── profilepicture/
│   └── reviews/
│
├── dist/                      # Compiled JavaScript (generated)
├── node_modules/              # Dependencies
├── package.json               # Project metadata & scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.ts             # Jest testing configuration
└── .env                        # Environment variables
```

---

## 🔐 Security Features

### Authentication
- **JWT Token-based Authentication**
  - Token issued on successful login/registration
  - Default expiration: 7 days
  - Secret key configured via environment variable

### Password Security
- **Bcrypt Hashing**
  - Salt rounds: 10 (configurable)
  - Passwords hashed before storage
  - Password reset functionality with email verification

### Authorization
- **Role-based Access Control**
  - Roles: `consumer`, `retailer`, `admin`
  - Middleware checks authorization for protected routes

### CORS Security
- **Configurable Origins** (default: localhost:3000, localhost:3005)
- **Credential Support**
- **Method Restrictions** (GET, POST, PUT, PATCH, DELETE)
- **Header Whitelisting**

### File Upload Security
- **Multer Middleware** for multipart/form-data
- **Dedicated Upload Handlers**
  - Product uploads
  - Review uploads
  - Profile pictures
- **Static File Serving** via `/uploads` endpoint

### Rate Limiting (Optional)
- **express-rate-limit** configured (currently disabled)
- Configurable window and max requests

---

##  Data Models

### 1. **User Model** (Base Authentication)
- Email (unique, indexed)
- Password hash
- Role (consumer, retailer, admin)
- Email verification status
- Password reset token

### 2. **Consumer Model**
- Auth ID (reference to User)
- Full Name
- Username
- Phone Number
- Date of Birth
- Gender
- Country
- Profile Picture
- Timestamps

### 3. **Retailer Model**
- Auth ID (reference to User)
- Store Name
- Business Registration Number
- Phone Number
- City/Country
- Store Description
- Logo/Banner Images
- Timestamps

### 4. **Product Model**
- Retailer ID (reference)
- Title
- Description
- Price
- Category
- Stock Quantity
- Images (array)
- SKU
- Timestamps

### 5. **Review Model**
- Consumer ID (reference)
- Product ID (reference)
- Rating (1-5)
- Comment
- Images (array)
- Helpful count
- Timestamps

### 6. **Collection Model**
- Retailer ID (reference)
- Name
- Description
- Products (array of Product IDs)
- Cover Image
- Timestamps

---

## 🔌 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register/consumer` - Register as consumer
- `POST /register/retailer` - Register as retailer
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /current-user` - Get current authenticated user
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password with token

### Consumers (`/api/consumers`)
- CRUD operations for consumer profiles
- Profile management
- Add/remove favorites

### Retailers (`/api/retailers`)
- CRUD operations for retailer profiles
- Store management
- Inventory management

### Products (`/api/products`)
- `GET /` - List products with filtering/pagination
- `GET /:id` - Get product details
- `POST /` - Create product (retailer only, with file upload)
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

### Reviews (`/api/reviews`)
- `GET /` - List reviews with filtering
- `GET /:id` - Get review details
- `POST /` - Create review (consumer only, with file upload)
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Collections (`/api/collections`)
- `GET /` - List collections
- `GET /:id` - Get collection details
- `POST /` - Create collection (retailer only)
- `PUT /:id` - Update collection
- `DELETE /:id` - Delete collection

### Admin (`/api/admin`)
- Administrative operations
- User management
- Platform analytics

---

## Build & Run Scripts

```bash
# Development - with auto-restart on file changes
npm run dev

# Production Build - compile TypeScript to JavaScript
npm run build

# Start Production Server
npm start

# Run Tests - verbose with open handle detection
npm test
```

### Environment Variables (`.env`)
```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/yayvo
JWT_SECRETS=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CORS_DOMAIN_FIRST=http://localhost:3000
CORS_DOMAIN_SECOND=http://localhost:3005
EMAIL=your-email@gmail.com
PASSWORD=your-app-password
CLIENT_URL=http://localhost:3000
```

---

## Testing

### Test Structure
- **Unit Tests**: Individual service/utility testing
- **Integration Tests**: End-to-end API testing
- **Mocks**: Mocked dependencies for isolation

### Test Files
- `src/__tests__/app.test.ts` - Application initialization tests
- `src/__tests__/integration/` - Integration test suite
  - `auth.integration.test.ts`
  - `product.integration.test.ts`
  - `consumer.integration.test.ts`
  - `retailer.integration.test.ts`
  - `review.integration.test.ts`
  - `collection.integration.test.ts`

### Test Database
- **mongodb-memory-server** for in-memory MongoDB during testing
- No external database dependencies for tests

---
## Error Handling

### Custom HTTP Error Class
- Standardized error responses
- HTTP status codes
- Error messages

### Global Error Handler
- Express error middleware in `app.ts`
- Catches all unhandled errors
- Returns consistent JSON response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Deployment Build Output

```
dist/
├── app.js
├── index.js
├── controller/
├── services/
├── repository/
├── routes/
├── models/
├── middlewares/
├── database/
├── config/
├── errors/
├── types/
└── utils/
```

Main entry point: `dist/index.js`

---

## Data Flow Example: User Registration

```
1. POST /api/auth/register/consumer
        ↓
2. [Route Handler] → consumer.route.ts
        ↓
3. [Controller] → auth.controller.ts (validate DTO)
        ↓
4. [Service] → auth.service.ts (business logic)
        ↓
5. [Repository] → user.repository.ts & consumer.repository.ts
        ↓
6. [Database] → MongoDB (create User & Consumer documents)
        ↓
7. [Service] → Generate JWT token
        ↓
8. [Response] → JSON with token and user data
```

---

## Key Architectural Decisions

1. **Separation of Concerns** - Clear layer separation for maintainability
2. **DTO Pattern** - Type-safe request validation with Zod
3. **Repository Pattern** - Database abstraction for testability
4. **Service Layer** - Centralized business logic
5. **TypeScript** - Full type safety across codebase
6. **Middleware Pipeline** - Express middleware for cross-cutting concerns
7. **Error Handling** - Centralized error management
8. **Testing First** - Comprehensive test coverage with Jest

---

## External Integrations

- **Nodemailer** - Email sending for password reset & notifications
- **File System** - Local file storage for uploads
- **CORS** - Cross-origin requests from frontend applications

---

##  Performance Considerations

- Rate limiting middleware (configurable)
- Query pagination for list endpoints
- Indexed MongoDB fields for frequent queries
- Static file caching via `/uploads` endpoint

---
