# 🛒 MERN Stack E-Commerce Platform

> **A comprehensive, production-ready RESTful API for modern e-commerce applications**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)

---

## 🎯 Overview

This is a **full-featured e-commerce backend** built with the MERN stack, designed to handle all aspects of modern online shopping platforms. The API provides robust authentication, product management, shopping cart functionality, order processing, payment integration, and comprehensive admin controls.

### **What Makes This Special?**

- ✅ **Production-Ready**: Built with industry best practices
- ✅ **Secure**: JWT authentication, bcrypt password hashing, email verification
- ✅ **Scalable**: Optimized queries, pagination, and caching strategies
- ✅ **Well-Documented**: Comprehensive Swagger/OpenAPI documentation
- ✅ **Validated**: Input validation on all endpoints using express-validator
- ✅ **Payment Ready**: Integrated with Stripe for online payments

---

## 🛠 Tech Stack

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### **Authentication & Security**

- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email verification and password reset
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### **Payment Integration**

- **Stripe** - Payment processing

### **Documentation**

- **Swagger/OpenAPI 3.0** - API documentation
- **swagger-jsdoc** - JSDoc to Swagger conversion
- **swagger-ui-express** - Interactive API explorer

### **Development Tools**

- **dotenv** - Environment variable management
- **morgan** - HTTP request logger
- **cors** - Cross-origin resource sharing

---

## ✨ Key Features

### **🔐 Authentication & Authorization**

- User registration with email verification
- Secure login with JWT tokens
- Password reset via email
- Role-based access control (User/Admin)
- Protected routes middleware

### **👤 User Management**

- User profile management
- Multiple shipping addresses
- Wishlist functionality
- Password change
- Account activation/deactivation

### **📦 Product Management**

- CRUD operations for products
- Category and brand organization
- Product images (cover + gallery)
- Stock management
- Discount pricing
- Color variants

### **⭐ Reviews & Ratings**

- User reviews on products
- Star ratings (1-5)
- Average rating calculation
- Review count tracking

### **🛒 Shopping Cart**

- Add/remove items
- Update quantities
- Color selection
- Coupon code application
- Price calculations

### **💳 Order Processing**

- Cash on delivery
- Online payment via Stripe
- Order history
- Order status tracking (Paid/Delivered)
- Admin order management

### **🎫 Coupon System**

- Create discount coupons
- Expiration dates
- Percentage-based discounts
- Admin-only management

### **🔍 Advanced Features**

- Search and filtering
- Sorting and pagination
- Query optimization
- Error handling middleware
- Request validation

---

## 📁 Project Structure

```
e-commerce/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handler
│   └── validation.js        # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Category.js          # Category schema
│   ├── Brand.js             # Brand schema
│   ├── Review.js            # Review schema
│   ├── Cart.js              # Cart schema
│   ├── Order.js             # Order schema
│   └── Coupon.js            # Coupon schema
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── user.routes.js       # User routes
│   ├── product.routes.js    # Product routes
│   ├── category.routes.js   # Category routes
│   ├── brand.routes.js      # Brand routes
│   ├── review.routes.js     # Review routes
│   ├── cart.routes.js       # Cart routes
│   ├── order.routes.js      # Order routes
│   └── coupon.routes.js     # Coupon routes
├── controllers/
│   └── [corresponding controllers]
├── utils/
│   ├── sendEmail.js         # Email utility
│   └── apiFeatures.js       # Query helpers
├── swagger/
│   └── swagger.js           # API documentation config
├── uploads/                 # Image uploads
├── .env                     # Environment variables
├── server.js                # Entry point
└── package.json
```

---

## 🗄 Database Schema

### **1. User Model**

**Purpose:** Handles authentication, user roles, and preferences.

| Field                  | Type            | Description               | Constraints                                  |
| ---------------------- | --------------- | ------------------------- | -------------------------------------------- |
| `name`                 | String          | User's full name          | Required, trimmed                            |
| `email`                | String          | Unique email for login    | Required, unique, validated                  |
| `password`             | String          | Hashed password           | Required, min 6 chars, bcrypt                |
| `phone`                | String          | Contact number            | Optional                                     |
| `profileImg`           | String          | Avatar URL                | Optional                                     |
| `role`                 | Enum            | User role                 | `['user', 'admin']`, default: `'user'`       |
| `active`               | Boolean         | Account status            | Default: `true`                              |
| `wishlist`             | Array[ObjectId] | Favorite products         | Ref: `Product`                               |
| `addresses`            | Array[Object]   | Shipping addresses        | `{ alias, city, street, postalCode, phone }` |
| `emailVerified`        | Boolean         | Email verification status | Default: `false`                             |
| `verificationCode`     | String          | Email verification code   | Hashed                                       |
| `passwordResetCode`    | String          | Password reset code       | Hashed, expires                              |
| `passwordResetExpires` | Date            | Reset code expiration     | Optional                                     |

---

### **2. Category Model**

**Purpose:** Organizes products into categories.

| Field   | Type   | Description             | Constraints               |
| ------- | ------ | ----------------------- | ------------------------- |
| `name`  | String | Category name           | Required, unique, trimmed |
| `slug`  | String | URL-friendly name       | Auto-generated, lowercase |
| `image` | String | Category icon/image URL | Optional                  |

---

### **3. Brand Model**

**Purpose:** Represents product manufacturers.

| Field   | Type   | Description       | Constraints               |
| ------- | ------ | ----------------- | ------------------------- |
| `name`  | String | Brand name        | Required, unique, trimmed |
| `slug`  | String | URL-friendly name | Auto-generated, lowercase |
| `image` | String | Brand logo URL    | Optional                  |

---

### **4. Product Model**

**Purpose:** Core entity representing products for sale.

| Field                | Type          | Description          | Constraints                       |
| -------------------- | ------------- | -------------------- | --------------------------------- |
| `title`              | String        | Product name         | Required, min 3 chars, trimmed    |
| `slug`               | String        | URL-friendly name    | Auto-generated                    |
| `description`        | String        | Detailed description | Required, min 20 chars            |
| `quantity`           | Number        | Available stock      | Required, min 0                   |
| `sold`               | Number        | Units sold           | Default: 0                        |
| `price`              | Number        | Base price           | Required, min 0                   |
| `priceAfterDiscount` | Number        | Discounted price     | Optional, must be < price         |
| `colors`             | Array[String] | Available colors     | Optional, e.g., `["Red", "Blue"]` |
| `imageCover`         | String        | Main product image   | Required                          |
| `images`             | Array[String] | Product gallery      | Optional, max 5 images            |
| `category`           | ObjectId      | Product category     | Required, Ref: `Category`         |
| `brand`              | ObjectId      | Product brand        | Optional, Ref: `Brand`            |
| `ratingsAverage`     | Number        | Average rating       | 1.0-5.0, calculated               |
| `ratingsQuantity`    | Number        | Total reviews        | Default: 0                        |

---

### **5. Review Model**

**Purpose:** User reviews and ratings for products.

| Field     | Type     | Description      | Constraints              |
| --------- | -------- | ---------------- | ------------------------ |
| `title`   | String   | Review text      | Required, min 10 chars   |
| `ratings` | Number   | Star rating      | Required, 1-5            |
| `user`    | ObjectId | Review author    | Required, Ref: `User`    |
| `product` | ObjectId | Reviewed product | Required, Ref: `Product` |

**Unique Constraint:** One review per user per product

---

### **6. Cart Model**

**Purpose:** Temporary storage for items before checkout.

| Field                     | Type          | Description        | Constraints                           |
| ------------------------- | ------------- | ------------------ | ------------------------------------- |
| `user`                    | ObjectId      | Cart owner         | Required, unique, Ref: `User`         |
| `cartItems`               | Array[Object] | Cart items         | `{ product, quantity, color, price }` |
| `totalCartPrice`          | Number        | Total price        | Calculated                            |
| `totalPriceAfterDiscount` | Number        | Price after coupon | Optional                              |

**Cart Item Structure:**

```javascript
{
  product: ObjectId,      // Ref: Product
  quantity: Number,       // Min: 1
  color: String,          // Optional
  price: Number           // Price at time of adding
}
```

---

### **7. Order Model**

**Purpose:** Final transaction record after checkout.

| Field               | Type          | Description        | Constraints                           |
| ------------------- | ------------- | ------------------ | ------------------------------------- |
| `user`              | ObjectId      | Order owner        | Required, Ref: `User`                 |
| `cartItems`         | Array[Object] | Ordered items      | Snapshot from cart                    |
| `shippingAddress`   | Object        | Delivery address   | Required                              |
| `paymentMethodType` | Enum          | Payment method     | `['card', 'cash']`, default: `'cash'` |
| `isPaid`            | Boolean       | Payment status     | Default: `false`                      |
| `paidAt`            | Date          | Payment timestamp  | Optional                              |
| `isDelivered`       | Boolean       | Delivery status    | Default: `false`                      |
| `deliveredAt`       | Date          | Delivery timestamp | Optional                              |
| `totalOrderPrice`   | Number        | Final amount paid  | Required                              |

---

### **8. Coupon Model**

**Purpose:** Discount code management.

| Field      | Type   | Description         | Constraints                 |
| ---------- | ------ | ------------------- | --------------------------- |
| `name`     | String | Coupon code         | Required, unique, uppercase |
| `expire`   | Date   | Expiration date     | Required                    |
| `discount` | Number | Discount percentage | Required, 1-100             |

---

## 🔌 API Documentation

> **Base URL:** `/api/v1`  
> **Response Format:** JSON `{ status: "success", data: {...} }`

### **Authentication Endpoints**

#### 🔓 Public Routes

| Method | Endpoint                | Description            | Request Body                                 |
| ------ | ----------------------- | ---------------------- | -------------------------------------------- |
| `POST` | `/auth/signup`          | Register new user      | `{ name, email, password, passwordConfirm }` |
| `POST` | `/auth/login`           | Login user             | `{ email, password }`                        |
| `POST` | `/auth/verifyEmail`     | Verify email with code | `{ email, code }`                            |
| `POST` | `/auth/forgotPassword`  | Request password reset | `{ email }`                                  |
| `POST` | `/auth/verifyResetCode` | Verify reset code      | `{ email, code }`                            |
| `PUT`  | `/auth/resetPassword`   | Reset password         | `{ email, newPassword }`                     |

**Response Example:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

### **User Management**

#### 🔒 Private Routes

| Method   | Endpoint                    | Description              | Access | Request Body                                     |
| -------- | --------------------------- | ------------------------ | ------ | ------------------------------------------------ |
| `GET`    | `/users/getMe`              | Get current user profile | User   | -                                                |
| `PUT`    | `/users/updateMe`           | Update profile           | User   | `{ name, email, phone }`                         |
| `PUT`    | `/users/changeMyPassword`   | Change password          | User   | `{ currentPassword, password, passwordConfirm }` |
| `DELETE` | `/users/deleteMe`           | Deactivate account       | User   | -                                                |
| `PUT`    | `/users/updateProfileImage` | Update profile image     | User   | Form-Data: `{ image }`                           |
| `DELETE` | `/users/deleteProfileImage` | Delete profile image     | User   | -                                                |

#### 👑 Admin Routes

| Method   | Endpoint                    | Description               | Request Body                      |
| -------- | --------------------------- | ------------------------- | --------------------------------- |
| `GET`    | `/users`                    | Get all users (paginated) | -                                 |
| `GET`    | `/users/:id`                | Get specific user         | -                                 |
| `POST`   | `/users`                    | Create user               | `{ name, email, password, role }` |
| `PUT`    | `/users/:id`                | Update user               | `{ name, email, role, active }`   |
| `DELETE` | `/users/:id`                | Delete user               | -                                 |
| `PUT`    | `/users/changePassword/:id` | Change user password      | `{ password, passwordConfirm }`   |

---

### **Categories & Brands**

#### 🏷 Category Endpoints

| Method   | Endpoint          | Description         | Access | Request                      |
| -------- | ----------------- | ------------------- | ------ | ---------------------------- |
| `GET`    | `/categories`     | List all categories | Public | Query: `?page=1&limit=10`    |
| `GET`    | `/categories/:id` | Get category by ID  | Public | -                            |
| `POST`   | `/categories`     | Create category     | Admin  | Form-Data: `{ name, image }` |
| `PUT`    | `/categories/:id` | Update category     | Admin  | Form-Data: `{ name, image }` |
| `DELETE` | `/categories/:id` | Delete category     | Admin  | -                            |

#### 🏢 Brand Endpoints

> **Note:** Brand endpoints follow the same structure as categories, just replace `/categories` with `/brands`

---

### **Products**

| Method   | Endpoint        | Description         | Access | Details                                                            |
| -------- | --------------- | ------------------- | ------ | ------------------------------------------------------------------ |
| `GET`    | `/products`     | List products       | Public | Query: `?keyword=phone&price[gte]=100&sort=-price&page=1&limit=20` |
| `GET`    | `/products/:id` | Get product details | Public | Includes reviews                                                   |
| `POST`   | `/products`     | Create product      | Admin  | Multipart form-data                                                |
| `PUT`    | `/products/:id` | Update product      | Admin  | Multipart form-data                                                |
| `DELETE` | `/products/:id` | Delete product      | Admin  | -                                                                  |

**Query Parameters:**

- `keyword` - Search in title/description
- `price[gte]` - Minimum price
- `price[lte]` - Maximum price
- `category` - Filter by category ID
- `brand` - Filter by brand ID
- `sort` - Sort by field (prefix with `-` for descending)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

### **Reviews**

#### Nested Product Reviews

| Method | Endpoint                       | Description         | Access | Request Body         |
| ------ | ------------------------------ | ------------------- | ------ | -------------------- |
| `GET`  | `/products/:productId/reviews` | Get product reviews | Public | -                    |
| `POST` | `/products/:productId/reviews` | Add review          | User   | `{ title, ratings }` |

#### Direct Review Access

| Method   | Endpoint       | Description         | Access     | Request Body              |
| -------- | -------------- | ------------------- | ---------- | ------------------------- |
| `GET`    | `/reviews`     | Get all reviews     | Public     | Query: `?page=1&limit=10` |
| `GET`    | `/reviews/:id` | Get specific review | Public     | -                         |
| `PUT`    | `/reviews/:id` | Update own review   | User       | `{ title, ratings }`      |
| `DELETE` | `/reviews/:id` | Delete review       | User/Admin | -                         |

---

### **Wishlist**

| Method   | Endpoint               | Description          | Access | Request Body    |
| -------- | ---------------------- | -------------------- | ------ | --------------- |
| `GET`    | `/wishlist`            | Get my wishlist      | User   | -               |
| `POST`   | `/wishlist`            | Add to wishlist      | User   | `{ productId }` |
| `DELETE` | `/wishlist/:productId` | Remove from wishlist | User   | -               |

---

### **Addresses**

| Method   | Endpoint         | Description      | Access | Request Body                                  |
| -------- | ---------------- | ---------------- | ------ | --------------------------------------------- |
| `GET`    | `/addresses`     | Get my addresses | User   | -                                             |
| `POST`   | `/addresses`     | Add address      | User   | `{ alias, details, phone, city, postalCode }` |
| `PUT`    | `/addresses/:id` | Update address   | User   | `{ alias, details, phone, city, postalCode }` |
| `DELETE` | `/addresses/:id` | Delete address   | User   | -                                             |

---

### **Shopping Cart**

| Method   | Endpoint            | Description          | Access | Request Body           |
| -------- | ------------------- | -------------------- | ------ | ---------------------- |
| `GET`    | `/cart`             | Get my cart          | User   | -                      |
| `POST`   | `/cart`             | Add item to cart     | User   | `{ productId, color }` |
| `PUT`    | `/cart/:itemId`     | Update item quantity | User   | `{ quantity }`         |
| `DELETE` | `/cart/:itemId`     | Remove item          | User   | -                      |
| `DELETE` | `/cart`             | Clear cart           | User   | -                      |
| `PUT`    | `/cart/applyCoupon` | Apply coupon code    | User   | `{ coupon }`           |

---

### **Orders**

#### 👤 User Routes

| Method   | Endpoint                           | Description             | Request Body          |
| -------- | ---------------------------------- | ----------------------- | --------------------- |
| `GET`    | `/orders`                          | Get my orders           | -                     |
| `GET`    | `/orders/:id`                      | Get specific order      | -                     |
| `POST`   | `/orders/:cartId`                  | Create cash order       | `{ shippingAddress }` |
| `GET`    | `/orders/checkout-session/:cartId` | Create Stripe session   | -                     |
| `PUT`    | `/orders/:id`                      | Update shipping address | `{ shippingAddress }` |
| `DELETE` | `/orders/:id`                      | Cancel order            | -                     |

#### 👑 Admin Routes

| Method | Endpoint              | Description                  | Request Body |
| ------ | --------------------- | ---------------------------- | ------------ |
| `GET`  | `/orders`             | Get all orders (with filter) | -            |
| `PUT`  | `/orders/:id/pay`     | Mark as paid                 | -            |
| `PUT`  | `/orders/:id/deliver` | Mark as delivered            | -            |

**Stripe Checkout Response:**

```json
{
  "status": "success",
  "session": {
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

---

### **Coupons (Admin Only)**

| Method   | Endpoint       | Description         | Request Body                 |
| -------- | -------------- | ------------------- | ---------------------------- |
| `GET`    | `/coupons`     | Get all coupons     | -                            |
| `GET`    | `/coupons/:id` | Get specific coupon | -                            |
| `POST`   | `/coupons`     | Create coupon       | `{ name, expire, discount }` |
| `PUT`    | `/coupons/:id` | Update coupon       | `{ name, expire, discount }` |
| `DELETE` | `/coupons/:id` | Delete coupon       | -                            |

---

## 🔒 Security Features

### **Authentication & Authorization**

- ✅ JWT-based authentication with secure token generation
- ✅ Password hashing using bcrypt (10 rounds)
- ✅ Email verification required before login
- ✅ Password reset with time-limited codes (10 minutes)
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes middleware

### **Input Validation**

- ✅ Comprehensive validation using express-validator
- ✅ Sanitization of user inputs
- ✅ Custom validation rules for each endpoint
- ✅ Detailed error messages for validation failures

### **Security Headers & Best Practices**

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting to prevent abuse
- ✅ NoSQL injection prevention
- ✅ XSS protection
- ✅ Environment variable protection

### **Error Handling**

- ✅ Global error handling middleware
- ✅ Production vs Development error responses
- ✅ Stack traces hidden in production
- ✅ Consistent error format

---

## 🚀 Setup & Installation

### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Stripe account (for payments)
- Gmail account (for emails)

### **Installation Steps**

1. **Clone the repository**

```bash
git clone <repository-url>
cd e-commerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**

```bash
# Make sure MongoDB is running
mongod
```

5. **Run the application**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the API**

- API: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api-docs`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=90d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourstore.com


# Frontend URL (for Stripe redirects)
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### **Gmail App Password Setup**

> [!IMPORTANT]
> You must use an App Password, not your regular Gmail password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security
3. Under "Signing in to Google", select "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password to `EMAIL_PASSWORD` in `.env`

---

## 🧪 Testing

### **API Testing with Swagger**

1. Start the server
2. Navigate to `http://localhost:3000/api-docs`
3. Use the interactive interface to test endpoints
4. Authenticate by clicking "Authorize" and entering your JWT token

### **Manual Testing**

Use tools like Postman or cURL:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get products (with authentication)
curl -X GET http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 API Response Format

### **Success Response**

```json
{
  "status": "success",
  "results": 10,
  "paginationResult": {
    "currentPage": 1,
    "limit": 10,
    "numberOfPages": 5,
    "next": 2
  },
  "data": {
    "products": [...]
  }
}
```

### **Error Response**

```json
{
  "status": "error",
  "message": "Product not found",
  "errors": [
    {
      "field": "productId",
      "message": "Invalid product ID format"
    }
  ]
}
```

---

## 📝 Additional Notes

### **Image Upload**

- Supported formats: JPG, PNG, WEBP
- Max file size: 5MB
- Images are stored in `/uploads` directory
- Use multipart/form-data for file uploads

### **Pagination**

- Default page size: 10 items
- Maximum page size: 100 items
- Use `?page=1&limit=20` query parameters

### **Rate Limiting**

- 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes

### **CORS**

- Configured to allow requests from specified origins
- Credentials are supported for cookie-based auth

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For questions or support, please contact:

- Email: support@yourstore.com
- Documentation: [API Docs](http://localhost:3000/api-docs)

---

**Built with ❤️ using the MERN Stack**
