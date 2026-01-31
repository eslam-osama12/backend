const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN E-commerce API",
      version: "1.0.0",
      description: "API Documentation for MERN Stack E-commerce Application",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", description: "User's full name" },
            email: {
              type: "string",
              format: "email",
              description: "Unique identifier for login",
            },
            password: {
              type: "string",
              format: "password",
              description: "Stored as a hashed value",
            },
            phone: {
              type: "string",
              description: "Contact number for delivery",
            },
            profileImg: {
              type: "string",
              description: "URL to user's avatar image",
            },
            role: { type: "string", enum: ["user", "admin"], default: "user" },
            active: {
              type: "boolean",
              default: true,
              description: "Is account active?",
            },
            wishlist: {
              type: "array",
              items: { type: "string" },
              description: "List of favorite products IDs",
            },
            addresses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  alias: { type: "string" },
                  city: { type: "string" },
                  street: { type: "string" },
                  postalCode: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        Category: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", description: "Category name" },
            slug: { type: "string", description: "URL-friendly version" },
            image: {
              type: "string",
              description: "URL of the category icon/image",
            },
          },
        },
        Brand: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", description: "Brand name" },
            slug: { type: "string", description: "URL-friendly version" },
            image: { type: "string", description: "Brand Logo URL" },
          },
        },
        Product: {
          type: "object",
          required: ["title", "quantity", "price", "category", "brand"],
          properties: {
            title: { type: "string", description: "Product name" },
            slug: { type: "string", description: "URL friendly" },
            description: {
              type: "string",
              description: "Detailed description",
            },
            quantity: { type: "number", description: "Stock available" },
            sold: { type: "number", default: 0, description: "Count of sales" },
            price: { type: "number", description: "Base price" },
            priceAfterDiscount: {
              type: "number",
              description: "Optional. Used for sales",
            },
            colors: {
              type: "array",
              items: { type: "string" },
              description: "Available colors",
            },
            imageCover: { type: "string", description: "Main image URL" },
            images: {
              type: "array",
              items: { type: "string" },
              description: "Array of URLs for product gallery",
            },
            category: { type: "string", description: "Category ID" },
            brand: { type: "string", description: "Brand ID" },
            ratingsAverage: {
              type: "number",
              description: "Calculated average (1.0 - 5.0)",
            },
            ratingsQuantity: {
              type: "number",
              description: "Total count of reviews",
            },
          },
        },
        Review: {
          type: "object",
          required: ["title", "ratings", "user", "product"],
          properties: {
            title: { type: "string", description: "The review text comment" },
            ratings: { type: "number", minimum: 1, maximum: 5 },
            user: { type: "string", description: "User ID" },
            product: { type: "string", description: "Product ID" },
          },
        },
        Cart: {
          type: "object",
          properties: {
            user: { type: "string", description: "User ID" },
            cartItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: { type: "string" },
                  quantity: { type: "number" },
                  color: { type: "string" },
                  price: { type: "number" },
                },
              },
            },
            totalCartPrice: {
              type: "number",
              description: "Sum of (price * quantity)",
            },
            totalPriceAfterDiscount: {
              type: "number",
              description: "Calculated only if coupon is applied",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            user: { type: "string", description: "User ID" },
            cartItems: { type: "array", items: { type: "object" } },
            paymentMethodType: { type: "string", enum: ["card", "cash"] },
            isPaid: { type: "boolean", description: "Payment status" },
            isDelivered: { type: "boolean", description: "Delivery status" },
            totalOrderPrice: {
              type: "number",
              description: "Final price paid",
            },
          },
        },
        Coupon: {
          type: "object",
          required: ["name", "expire", "discount"],
          properties: {
            name: { type: "string", description: "Code (e.g. SALE20)" },
            expire: {
              type: "string",
              format: "date-time",
              description: "Expiration date",
            },
            discount: { type: "number", description: "Percentage value" },
          },
        },
      },
    },
  },
  apis: [__dirname + "/swagger.js"], // Read JSDoc from this file
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: User management
 *   - name: Categories
 *     description: Category management
 *   - name: Brands
 *     description: Brand management
 *   - name: Products
 *     description: Product management
 *   - name: Reviews
 *     description: Review management
 *   - name: Wishlist
 *     description: Wishlist management
 *   - name: Addresses
 *     description: Address management
 *   - name: Cart
 *     description: Shopping cart management
 *   - name: Orders
 *     description: Order management
 *   - name: Coupons
 *     description: Coupon management
 */

// -----------------------------------------------------------------------------
// 2.1 Authentication
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create new user account
 *     description: Register a new user with email domain validation. Email must have valid MX records.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, passwordConfirm]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *                 description: Must be a valid email with existing domain (MX records checked)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 minLength: 6
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Must match password
 *     responses:
 *       201:
 *         description: Signup successful, verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Signup successful! Please check your email to verify your account.
 *       400:
 *         description: Validation error (invalid email domain, passwords don't match, etc.)
 *       500:
 *         description: Failed to send verification email
 */

/**
 * @swagger
 * /auth/verifyEmail:
 *   post:
 *     summary: Verify email address
 *     description: Verify email using the 6-digit code sent to your email after signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, verificationCode]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Email verified successfully!
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or expired verification code
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and generate token
 *     description: Login requires verified email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials or email not verified
 */

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Request password reset code
 *     description: Sends a 6-digit reset code to your email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *     responses:
 *       200:
 *         description: Reset code sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Reset code sent to your email!
 *                 resetCode:
 *                   type: string
 *                   example: "123456"
 *                   description: Only returned in development mode (NODE_ENV=development)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send email
 */

/**
 * @swagger
 * /auth/verifyResetCode:
 *   post:
 *     summary: Verify password reset code
 *     description: Validates the 6-digit reset code received from forgotPassword endpoint
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resetCode]
 *             properties:
 *               resetCode:
 *                 type: string
 *                 example: "123456"
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: 6-digit numeric code
 *     responses:
 *       200:
 *         description: Reset code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Invalid or expired reset code
 */

/**
 * @swagger
 * /auth/resetPassword:
 *   put:
 *     summary: Reset password with verified code
 *     description: Sets a new password after reset code has been verified. Must call verifyResetCode first.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *                 token:
 *                   type: string
 *                   description: JWT token for immediate login
 *       400:
 *         description: Reset code not verified or invalid request
 *       404:
 *         description: User not found
 */

// -----------------------------------------------------------------------------
// 2.2 User Management
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /users/getMe:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/updateMe:
 *   put:
 *     summary: Update profile info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               profileImg:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/changeMyPassword:
 *   put:
 *     summary: Change Password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, password, passwordConfirm]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */

// -----------------------------------------------------------------------------
// 2.3 Categories & Brands
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get specific category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of brands
 *   post:
 *     summary: Create brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Brand created
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get specific brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 *       404:
 *         description: Brand not found
 *   put:
 *     summary: Update brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Brand updated
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Brand not found
 *   delete:
 *     summary: Delete brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Brand deleted
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Brand not found
 */

// -----------------------------------------------------------------------------
// 2.4 Products
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: e.g. -price
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, quantity, price, category, brand, imageCover]
 *             properties:
 *               title:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details with reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               imageCover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Product not found
 */

// -----------------------------------------------------------------------------
// 2.5 Reviews, Wishlist & Address
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     summary: Get reviews for product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 *   post:
 *     summary: Add Review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, ratings]
 *             properties:
 *               title:
 *                 type: string
 *               ratings:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Review added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get my Wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wishlist
 *   post:
 *     summary: Add to Wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to wishlist
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove from Wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from wishlist
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get Addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *   post:
 *     summary: Add Address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alias, details, phone, city, postalCode]
 *             properties:
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added
 *       401:
 *         description: Unauthorized
 */

// -----------------------------------------------------------------------------
// 2.6 Cart & Orders (Checkout)
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get my Cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *   post:
 *     summary: Add to Cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, color]
 *             properties:
 *               productId:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to cart
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/{itemId}:
 *   put:
 *     summary: Update Quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Remove Item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /cart/applyCoupon:
 *   put:
 *     summary: Apply Coupon
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [coupon]
 *             properties:
 *               coupon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon applied
 *       400:
 *         description: Invalid coupon
 */

/**
 * @swagger
 * /orders/{cartId}:
 *   post:
 *     summary: Create Cash Order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   details:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/checkout-session/{cartId}:
 *   post:
 *     summary: Stripe Checkout Session
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stripe session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get my Orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get All Orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /orders/{id}/pay:
 *   put:
 *     summary: Mark as Paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /orders/{id}/deliver:
 *   put:
 *     summary: Mark as Delivered
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as delivered
 *       403:
 *         description: Forbidden (Admin only)
 */

// -----------------------------------------------------------------------------
// 2.7 Coupons (Admin)
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 *       403:
 *         description: Forbidden (Admin only)
 *   post:
 *     summary: Create Coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, expire, discount]
 *             properties:
 *               name:
 *                 type: string
 *               expire:
 *                 type: string
 *                 format: date-time
 *               discount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Coupon created
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update Coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               expire:
 *                 type: string
 *                 format: date-time
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Coupon updated
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Coupon not found
 *   delete:
 *     summary: Delete Coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Coupon deleted
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get specific coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Coupon not found
 */

// -----------------------------------------------------------------------------
// 2.8 Additional Address Endpoints
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /addresses/{addressId}:
 *   put:
 *     summary: Update address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *   delete:
 *     summary: Remove address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address removed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

// -----------------------------------------------------------------------------
// 2.9 Additional User Endpoints
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /users/deleteMe:
 *   delete:
 *     summary: Deactivate my account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deactivated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/updateProfileImage:
 *   put:
 *     summary: Update profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/deleteProfileImage:
 *   delete:
 *     summary: Delete profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/changePassword/{id}:
 *   put:
 *     summary: Change user password (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, passwordConfirm]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, passwordConfirm]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get specific user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */

// -----------------------------------------------------------------------------
// 2.10 Additional Cart Endpoints
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 */

// -----------------------------------------------------------------------------
// 2.11 Additional Order Endpoints
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update order shipping address
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   details:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Order updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

// -----------------------------------------------------------------------------
// 2.12 Additional Review Endpoints
// -----------------------------------------------------------------------------

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get specific review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ratings:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
