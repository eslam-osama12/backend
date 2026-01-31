/**
 * ========================================
 * IMAGE UPLOAD & DELETION SYSTEM - COMPLETE GUIDE
 * ========================================
 * 
 * This file demonstrates how the image upload and deletion system works
 * for products, categories, and brands in the e-commerce backend.
 * 
 * KEY FEATURES:
 * ✅ Images are saved to specific folders (/uploads/products, /uploads/categories, /uploads/brands)
 * ✅ Image paths are stored in the database
 * ✅ Old images are automatically deleted when updating with new images
 * ✅ All images are deleted when deleting a product/category/brand
 * ✅ Uses fs.promises for async operations (better performance)
 * ✅ Proper error handling - only deletes if file exists
 */

// ========================================
// 1. HOW IMAGE UPLOAD WORKS
// ========================================

/**
 * MIDDLEWARE FLOW FOR CREATING/UPDATING:
 * 
 * 1. uploadImageMiddleware - Handles file upload using multer (stores in memory)
 * 2. resizeImageMiddleware - Processes the image:
 *    - For UPDATES: Fetches old document and deletes old image files
 *    - Resizes the new image
 *    - Saves to disk (uploads/categories, uploads/brands, or uploads/products)
 *    - Sets req.body.image (or imageCover/images for products)
 * 3. Controller - Saves the image path to database
 */

// ========================================
// 2. CATEGORY EXAMPLE
// ========================================

/**
 * CREATE CATEGORY WITH IMAGE
 * 
 * Request: POST /api/v1/categories
 * Content-Type: multipart/form-data
 * 
 * Body:
 * - name: "Electronics"
 * - image: [file upload]
 * 
 * What happens:
 * 1. uploadSingleImage('image') - Uploads file to memory
 * 2. resizeCategoryImage - Resizes to 600x600, saves to uploads/categories/category-uuid-timestamp.jpeg
 * 3. createCategory - Saves category with image path to database
 * 
 * Database result:
 * {
 *   _id: "...",
 *   name: "Electronics",
 *   slug: "electronics",
 *   image: "uploads/categories/category-abc123-1234567890.jpeg"
 * }
 */

/**
 * UPDATE CATEGORY WITH NEW IMAGE
 * 
 * Request: PUT /api/v1/categories/:id
 * Content-Type: multipart/form-data
 * 
 * Body:
 * - name: "Electronics & Gadgets"
 * - image: [new file upload]
 * 
 * What happens:
 * 1. uploadSingleImage('image') - Uploads new file to memory
 * 2. resizeCategoryImage:
 *    - Detects this is an update (req.params.id exists)
 *    - Fetches old category from database
 *    - Deletes old image file: uploads/categories/category-abc123-1234567890.jpeg
 *    - Resizes new image to 600x600
 *    - Saves new image: uploads/categories/category-xyz789-9876543210.jpeg
 * 3. updateCategory - Updates database with new image path
 * 
 * Result: Old image is deleted, new image is saved
 */

/**
 * DELETE CATEGORY
 * 
 * Request: DELETE /api/v1/categories/:id
 * 
 * What happens:
 * 1. deleteCategory controller:
 *    - Fetches category from database
 *    - Deletes image file from disk using fs.promises
 *    - Deletes category from database
 * 
 * Result: Both database record and image file are removed
 */

// ========================================
// 3. BRAND EXAMPLE
// ========================================

/**
 * Same flow as categories:
 * - CREATE: POST /api/v1/brands with image field
 * - UPDATE: PUT /api/v1/brands/:id with image field (old image auto-deleted)
 * - DELETE: DELETE /api/v1/brands/:id (image file deleted)
 * 
 * Images saved to: uploads/brands/brand-uuid-timestamp.jpeg
 * Resize: 600x600
 */

// ========================================
// 4. PRODUCT EXAMPLE (Multiple Images)
// ========================================

/**
 * CREATE PRODUCT WITH IMAGES
 * 
 * Request: POST /api/v1/products
 * Content-Type: multipart/form-data
 * 
 * Body:
 * - title: "iPhone 15 Pro"
 * - description: "..."
 * - price: 999
 * - category: "category_id"
 * - imageCover: [file upload - main image]
 * - images: [file upload 1, file upload 2, file upload 3] - up to 5 images
 * 
 * What happens:
 * 1. uploadMixOfImages - Uploads imageCover (1 file) and images (up to 5 files) to memory
 * 2. resizeProductImages:
 *    - Processes imageCover: resize to 2000x1333, save to uploads/products/product-uuid-timestamp-cover.jpeg
 *    - Processes images: resize each to 2000x1333, save to uploads/products/product-uuid-timestamp-1.jpeg, etc.
 * 3. createProduct - Saves product with image paths to database
 * 
 * Database result:
 * {
 *   _id: "...",
 *   title: "iPhone 15 Pro",
 *   imageCover: "uploads/products/product-abc123-1234567890-cover.jpeg",
 *   images: [
 *     "uploads/products/product-abc123-1234567890-1.jpeg",
 *     "uploads/products/product-abc123-1234567890-2.jpeg",
 *     "uploads/products/product-abc123-1234567890-3.jpeg"
 *   ]
 * }
 */

/**
 * UPDATE PRODUCT WITH NEW IMAGES
 * 
 * Request: PUT /api/v1/products/:id
 * Content-Type: multipart/form-data
 * 
 * Body:
 * - imageCover: [new file upload] (optional)
 * - images: [new file 1, new file 2] (optional)
 * 
 * What happens:
 * 1. uploadMixOfImages - Uploads new files to memory
 * 2. resizeProductImages:
 *    - Detects this is an update (req.params.id exists)
 *    - Fetches old product from database
 *    - If imageCover uploaded: Deletes old cover image, saves new one
 *    - If images uploaded: Deletes ALL old images, saves new ones
 *    - Resizes and saves new images
 * 3. updateProduct - Updates database with new image paths
 * 
 * Result: Old images are deleted, new images are saved
 */

/**
 * DELETE PRODUCT
 * 
 * Request: DELETE /api/v1/products/:id
 * 
 * What happens:
 * 1. deleteProduct controller:
 *    - Fetches product from database
 *    - Deletes cover image file using fs.promises
 *    - Deletes all images files using Promise.all
 *    - Deletes product from database
 * 
 * Result: Database record and all image files are removed
 */

// ========================================
// 5. FILE SYSTEM STRUCTURE
// ========================================

/**
 * /uploads
 *   /categories
 *     category-uuid1-timestamp1.jpeg
 *     category-uuid2-timestamp2.jpeg
 *   /brands
 *     brand-uuid1-timestamp1.jpeg
 *     brand-uuid2-timestamp2.jpeg
 *   /products
 *     product-uuid1-timestamp1-cover.jpeg
 *     product-uuid1-timestamp1-1.jpeg
 *     product-uuid1-timestamp1-2.jpeg
 *     product-uuid2-timestamp2-cover.jpeg
 */

// ========================================
// 6. KEY IMPLEMENTATION DETAILS
// ========================================

/**
 * WHY DELETE IN MIDDLEWARE (resizeImageMiddleware)?
 * 
 * The middleware runs BEFORE the controller, so it has the perfect timing to:
 * 1. Check if this is an update (req.params.id exists)
 * 2. Fetch the old document from database
 * 3. Delete old image files
 * 4. Process and save new images
 * 5. Pass new image paths to controller via req.body
 * 
 * This ensures no orphaned files remain on the server.
 */

/**
 * WHY USE fs.promises INSTEAD OF fs (sync)?
 * 
 * - Better performance: Doesn't block the event loop
 * - Proper async/await support
 * - Better error handling with try/catch
 * - Modern Node.js best practice
 */

/**
 * ERROR HANDLING
 * 
 * The system gracefully handles:
 * - File doesn't exist (ENOENT error) - logs but doesn't crash
 * - Permission errors - logs error message
 * - Other file system errors - logs error message
 */

// ========================================
// 7. TESTING THE SYSTEM
// ========================================

/**
 * MANUAL TESTING STEPS:
 * 
 * 1. Create a category with an image
 *    - Check uploads/categories folder - image should exist
 *    - Check database - image path should be stored
 * 
 * 2. Update the category with a new image
 *    - Check uploads/categories folder - old image should be deleted, new image should exist
 *    - Check database - new image path should be stored
 * 
 * 3. Delete the category
 *    - Check uploads/categories folder - image should be deleted
 *    - Check database - category should be removed
 * 
 * Repeat for brands and products!
 */

// ========================================
// 8. COMMON ISSUES & SOLUTIONS
// ========================================

/**
 * ISSUE: Old images not being deleted
 * SOLUTION: Make sure req.params.id is available in the middleware
 * 
 * ISSUE: "File not found" errors
 * SOLUTION: The system now handles this gracefully - it's not an error if file doesn't exist
 * 
 * ISSUE: Permission denied errors
 * SOLUTION: Check folder permissions - uploads folder should be writable
 * 
 * ISSUE: Images not uploading
 * SOLUTION: Check multer configuration and ensure Content-Type is multipart/form-data
 */

// ========================================
// 9. CODE REFERENCES
// ========================================

/**
 * Key files:
 * - middlewares/uploadImageMiddleware.js - Handles file upload with multer
 * - middlewares/resizeImageMiddleware.js - Processes images and deletes old ones
 * - controllers/categoryController.js - Category CRUD operations
 * - controllers/brandController.js - Brand CRUD operations
 * - controllers/productController.js - Product CRUD operations
 * - routes/categoryRoute.js - Category routes with middleware chain
 * - routes/brandRoute.js - Brand routes with middleware chain
 * - routes/productRoute.js - Product routes with middleware chain
 */

module.exports = {
  // This file is for documentation purposes only
  // No exports needed
};
