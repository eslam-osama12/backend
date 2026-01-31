# API Documentation

## API Summary

| Domain             | Total APIs | Description                         |
| :----------------- | :--------: | :---------------------------------- |
| **Authentication** |     6      | Signup, Login, Password Reset       |
| **Users**          |     12     | Profile management, Admin user CRUD |
| **Categories**     |     5      | Product categories management       |
| **Brands**         |     5      | Product brands management           |
| **Products**       |     5      | Product catalog and inventory       |
| **Reviews**        |     6      | Product ratings and comments        |
| **Wishlist**       |     3      | User favorites list                 |
| **Addresses**      |     4      | User shipping addresses             |
| **Coupons**        |     5      | Discount codes management           |
| **Cart**           |     6      | Shopping cart operations            |
| **Orders**         |     9      | Checkout, payment, and fulfillment  |

---

## 1. Authentication

### Signup

**POST** `/auth/signup`

**Description:**
Register a new user account. Validates email domain presence (MX records) and ensures unique email.

**Authentication:**
Not required

**Request Body:**

- `name` (string, required): Min 3, Max 50 chars.
- `email` (string, required): Valid email format. Domain must have MX records.
- `password` (string, required): Min 6 chars.
- `passwordConfirm` (string, required): Must match `password`.

**Success Response:**
**Status Code:** 201 Created

```json
{
  "status": "success",
  "message": "Signup successful! Please check your email to verify your account."
}
```

**Error Responses:**

- 400 Bad Request: Validation error (e.g. passwords don't match, invalid email, email exists).
- 500 Internal Server Error: Email sending failed.

---

### Login

**POST** `/auth/login`

**Description:**
Authenticate user and retrieve JWT token.

**Authentication:**
Not required

**Request Body:**

- `email` (string, required): Valid email format.
- `password` (string, required).

**Success Response:**
**Status Code:** 200 OK

```json
{
  "data": {
    "_id": "64b...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error Responses:**

- 401 Unauthorized: Incorrect email or password.

---

### Verify Email

**POST** `/auth/verifyEmail`

**Description:**
Verify user account using the 6-digit code sent via email.

**Authentication:**
Not required

**Request Body:**

- `email` (string, required): Valid email format.
- `verificationCode` (string, required): Exact 6 digits, numeric.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "message": "Email verified successfully!",
  "token": "jwt_token_here"
}
```

**Error Responses:**

- 400 Bad Request: Invalid or expired code.

---

### Forgot Password

**POST** `/auth/forgotPassword`

**Description:**
Request a password reset code to be sent to the registered email.

**Authentication:**
Not required

**Request Body:**

- `email` (string, required): Valid email format.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "message": "Reset code sent to your email!"
}
```

**Error Responses:**

- 404 Not Found: No user found with this email.

---

### Verify Reset Code

**POST** `/auth/verifyResetCode`

**Description:**
Verify the password reset code before allowing password change.

**Authentication:**
Not required

**Request Body:**

- `resetCode` (string, required): Exact 6 digits, numeric.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success"
}
```

**Error Responses:**

- 400 Bad Request: Invalid or expired code.

---

### Reset Password

**PUT** `/auth/resetPassword`

**Description:**
Set a new password after successful code verification.

**Authentication:**
Not required

**Request Body:**

- `email` (string, required): Valid email.
- `newPassword` (string, required): Min 6 chars.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "message": "Password reset successful",
  "token": "new_jwt_token"
}
```

---

---

+### Google Login

- +**POST** `/auth/googleLogin`
- +**Description:**
  +Authenticate user using Google ID Token. If user doesn't exist, a new verified account is created.
- +**Authentication:**
  +Not required
- +**Request Body:**
- +- `idToken` (string, required): Google ID Token from frontend.
- +**Success Response:** +**Status Code:** 200 OK
- +```json
  +{
- "status": "success",
- "token": "jwt_token",
- "data": {
- "\_id": "...",
- "name": "User Name",
- "email": "user@gmail.com",
- "role": "user",
- "googleId": "..."
- }
  +}
  +```
- +---
- ## 2. Users

### Get Current User

**GET** `/users/getMe`

**Description:**
Retrieve profile information for the currently logged-in user.

**Authentication:**
Required (Bearer Token)

**Success Response:**
**Status Code:** 200 OK

```json
{
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "active": true
  }
}
```

---

### Update User Profile

**PUT** `/users/updateMe`

**Description:**
Update current user's general information.

**Authentication:**
Required (Bearer Token)

**Request Body:**

- `name` (string, optional): Min 3 chars.
- `email` (string, optional): Valid email. Must be unique.
- `phone` (string, optional): Valid mobile number (ar-EG, ar-SA).

**Success Response:**
**Status Code:** 200 OK

```json
{
  "data": { "updated user object..." }
}
```

---

### Change My Password

**PUT** `/users/changeMyPassword`

**Description:**
Update the logged-in user's password.

**Authentication:**
Required (Bearer Token)

**Request Body:**

- `currentPassword` (string, required).
- `password` (string, required): Min 6 chars.
- `passwordConfirm` (string, required): Must match `password`.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "token": "new_token",
  "data": { ... }
}
```

---

### Update Profile Image

**PUT** `/users/updateProfileImage`

**Description:**
Upload and set a new profile image.

**Authentication:**
Required (Bearer Token)

**Headers:**

- `Content-Type`: multipart/form-data

**Request Body:**

- `image` (file, required): Image file.

**Success Response:**
**Status Code:** 200 OK

---

### Deactivate Account

**DELETE** `/users/deleteMe`

**Description:**
Deactivate the current user's account (soft delete).

**Authentication:**
Required (Bearer Token)

**Success Response:**
**Status Code:** 204 No Content

---

### Admin User Management

_(Requires Admin Role)_

- **GET** `/users` - List users. Supports pagination (`?page=1&limit=10`).
- **POST** `/users` - Create user. Required: `name`, `email`, `password`, `passwordConfirm`. Optional: `role`, `phone`.
- **GET** `/users/:id` - Get user details.
- **PUT** `/users/:id` - Update user. Can update role.
- **DELETE** `/users/:id` - Delete user permanently.
- **PUT** `/users/changePassword/:id` - Force change user password.

---

## 3. Categories

### List Categories

**GET** `/categories`

**Description:**
Retrieve a paginated list of categories.

**Query Parameters:**

- `page` (int, optional): Default 1.
- `limit` (int, optional): Default 5.

**Success Response:**
**Status Code:** 200 OK

```json
{
  "results": 5,
  "paginationResult": { "currentPage": 1, "numberOfPages": 3, "limit": 5 },
  "data": [
    {
      "_id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "image": "url"
    }
  ]
}
```

### Create Category

**POST** `/categories`

**Description:**
Create a new product category.

**Authentication:**
Required (Admin only)

**Headers:**

- `Content-Type`: multipart/form-data

**Request Body:**

- `name` (string, required): Min 3, Max 32 chars. Unique.
- `image` (file, optional): Category image.

**Success Response:**
**Status Code:** 201 Created

### Update Category

**PUT** `/categories/:id`

**Description:**
Update an existing category.

**Authentication:**
Required (Admin/Manager)

**Request Body:**

- `name` (string, optional): Min 3, Max 32 chars.
- `image` (file, optional): Updated category image.

**Success Response:**
**Status Code:** 200 OK

### Delete Category

**DELETE** `/categories/:id`

**Description:**
Permanently delete a category.

**Authentication:**
Required (Admin)

**Success Response:**
**Status Code:** 204 No Content

---

## 4. Brands

### List Brands

**GET** `/brands`

**Description:**
Retrieve a paginated list of brands.

**Success Response:**
**Status Code:** 200 OK

### Create Brand

**POST** `/brands`

**Description:**
Create a new brand.

**Authentication:**
Required (Admin only)

**Headers:**

- `Content-Type`: multipart/form-data

**Request Body:**

- `name` (string, required): Min 3, Max 32 chars. Unique.
- `image` (file, optional): Brand logo.

**Success Response:**
**Status Code:** 201 Created

### Update Brand

**PUT** `/brands/:id`

**Description:**
Update an existing brand.

**Authentication:**
Required (Admin/Manager)

**Request Body:**

- `name` (string, optional): Min 3, Max 32 chars.
- `image` (file, optional): Updated brand logo.

**Success Response:**
**Status Code:** 200 OK

### Delete Brand

**DELETE** `/brands/:id`

**Description:**
Permanently delete a brand.

**Authentication:**
Required (Admin)

**Success Response:**
**Status Code:** 204 No Content

---

## 5. Products

### List Products

**GET** `/products`

**Description:**
Retrieve products with advanced filtering, sorting, and pagination.

**Query Parameters:**

- `page`, `limit`: Pagination.
- `sort`: Sort field (e.g., `-price` for desc, `price` for asc).
- `keyword`: Search in title/description.
- `price[gte]`, `price[lte]`: Price range filter.
- `category`: Filter by category ID.
- `brand`: Filter by brand ID.

**Success Response:**
**Status Code:** 200 OK

---

### Create Product

**POST** `/products`

**Description:**
Create a new product.

**Authentication:**
Required (Admin/Manager)

**Headers:**

- `Content-Type`: multipart/form-data

**Request Body:**

- `title` (string, required): Min 3, Max 100 chars.
- `description` (string, required): Min 20 chars.
- `quantity` (number, required): Positive integer.
- `price` (number, required): Max 200000.
- `priceAfterDiscount` (number, optional): Must be < price.
- `colors` (array of strings, optional).
- `imageCover` (file, required).
- `images` (array of files, optional).
- `category` (MongoID, required): Must exist.
- `brand` (MongoID, optional): Must exist.

**Success Response:**
**Status Code:** 201 Created

---

### Get Product Details

**GET** `/products/:id`

**Description:**
Get full details of a single product.

**Success Response:**
**Status Code:** 200 OK

---

## 6. Reviews

### Add Review

**POST** `/reviews`
_(Also available at POST `/products/:productId/reviews`)_

**Description:**
Add a review to a product. User can review a product only once.

**Authentication:**
Required (User)

**Request Body:**

- `title` (string, optional): Min 3, Max 200 chars.
- `ratings` (number, required): Float 1.0 - 5.0.
- `product` (MongoID, required): Valid Product ID.
- `user` (MongoID, optional): Inferred from token if not provided.

**Success Response:**
**Status Code:** 201 Created

---

## 7. Wishlist

### Get My Wishlist

**GET** `/wishlist`

**Description:**
Get list of products in the current user's wishlist.

**Authentication:**
Required (User)

**Success Response:**
**Status Code:** 200 OK

### Add to Wishlist

**POST** `/wishlist`

**Description:**
Add a product ID to the wishlist array.

**Authentication:**
Required (User)

**Request Body:**

- `productId` (MongoID, required).

**Success Response:**
**Status Code:** 200 OK

### Remove from Wishlist

**DELETE** `/wishlist/:productId`

**Description:**
Remove a product from the wishlist.

**Authentication:**
Required (User)

**Success Response:**
**Status Code:** 200 OK

---

## 8. Addresses

### Add Address

**POST** `/addresses`

**Description:**
Add a new shipping address to the user's address book.

**Authentication:**
Required (User)

**Request Body:**

- `alias` (string, required): e.g., "Home", "Work".
- `details` (string, required).
- `phone` (string, required): Valid mobile number.
- `city` (string, required).
- `postalCode` (string, required).

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "message": "Address added successfully.",
  "data": ["Array of addresses..."]
}
```

### Get Addresses

**GET** `/addresses`

**Description:**
List all saved addresses.

**Authentication:**
Required (User)

**Success Response:**
**Status Code:** 200 OK

---

### Update Address

**PUT** `/addresses/:addressId`

**Description:**
Update details of an existing shipping address.

**Authentication:**
Required (User)

**Request Body:**

- `alias` (string, optional): e.g., "Home", "Work".
- `details` (string, optional).
- `phone` (string, optional).
- `city` (string, optional).
- `postalCode` (string, optional).

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "message": "Address updated successfully.",
  "data": ["Array of updated addresses..."]
}
```

---

## 9. Coupons

### Create Coupon

**POST** `/coupons`

**Description:**
Create a discount coupon.

**Authentication:**
Required (Admin/Manager)

**Request Body:**

- `name` (string, required): Uppercase, unique.
- `expire` (date, required): Future date.
- `discount` (number, required): Percentage 1-100.

**Success Response:**
**Status Code:** 201 Created

---

## 10. Cart

### Add to Cart

**POST** `/cart`

**Description:**
Add product to cart or update quantity if it exists.

**Authentication:**
Required (User)

**Request Body:**

- `productId` (MongoID, required).
- `color` (string, optional).

**Success Response:**
**Status Code:** 200 OK

### Apply Coupon

**PUT** `/cart/applyCoupon`

**Description:**
Apply a valid coupon to the cart.

**Authentication:**
Required (User)

**Request Body:**

- `coupon` (string, required).

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "numOfCartItems": 3,
  "data": { "totalCartPrice": 100, "totalPriceAfterDiscount": 80 }
}
```

---

## 11. Orders

### Create Cash Order

**POST** `/orders/:cartId`

**Description:**
Create an order with "cash" payment method.

**Authentication:**
Required (User)

**Request Body:**

- `shippingAddress` (object, optional):
  - `details` (string).
  - `phone` (string).
  - `city` (string).
  - `postalCode` (string).

**Success Response:**
**Status Code:** 201 Created

### Create Stripe Session

**POST** `/orders/checkout-session/:cartId`

**Description:**
Generate a Stripe checkout session URL for card payment.

**Authentication:**
Required (User)

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "session": { "url": "https://checkout.stripe.com/..." }
}
```

### Get My Orders

**GET** `/orders`

**Description:**
Get order history for the logged-in user.

**Authentication:**
**Success Response:**
**Status Code:** 200 OK

---

## 12. Dashboard

### Get Dashboard Stats

**GET** `/dashboard/stats`

**Description:**
Retrieve statistics, recent orders, and sales trends for the admin dashboard.

**Authentication:**
Required (Admin/Manager)

**Success Response:**
**Status Code:** 200 OK

```json
{
  "status": "success",
  "data": {
    "stats": {
      "ordersCount": 150,
      "productsCount": 45,
      "usersCount": 89,
      "totalRevenue": 15400.5
    },
    "recentOrders": [
      {
        "_id": "...",
        "totalOrderPrice": 120,
        "status": "delivered",
        "createdAt": "2023-10-01T...",
        "user": { "name": "John Doe", "email": "john@example.com" }
      }
    ],
    "ordersByStatus": [
      { "_id": "delivered", "count": 120 },
      { "_id": "processing", "count": 30 }
    ],
    "salesTrend": [
      {
        "_id": { "month": 10, "year": 2023 },
        "revenue": 5000,
        "orders": 40
      }
    ]
  }
}
```
