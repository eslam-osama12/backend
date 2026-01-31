const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Load models
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

// Connect to DB
mongoose
  .connect(
    process.env.DATABASE_LOCAL || "mongodb://localhost:27017/ecommerce-db",
  )
  .then(() => console.log("DB Connection successful!"))
  .catch((err) => {
    console.error("DB Connection error:", err);
    process.exit(1);
  });

// Read data
const productsData = JSON.parse(
  fs.readFileSync("./products_150.json", "utf-8"),
);

const importData = async () => {
  try {
    console.log("--- Starting Data Import ---");

    // 1. Extract Unique Categories and Brands
    const uniqueCategories = [...new Set(productsData.map((p) => p.category))];
    const uniqueBrands = [...new Set(productsData.map((p) => p.brand))];

    console.log(
      `Found ${uniqueCategories.length} categories and ${uniqueBrands.length} brands.`,
    );

    // 2. Create Categories
    const categoryMap = {};
    for (const catName of uniqueCategories) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({
          name: catName,
          slug: slugify(catName, { lower: true }),
        });
        console.log(`Created Category: ${catName}`);
      }
      categoryMap[catName] = category._id;
    }

    // 3. Create Brands
    const brandMap = {};
    for (const brandName of uniqueBrands) {
      let brand = await Brand.findOne({ name: brandName });
      if (!brand) {
        brand = await Brand.create({
          name: brandName,
          slug: slugify(brandName, { lower: true }),
        });
        console.log(`Created Brand: ${brandName}`);
      }
      brandMap[brandName] = brand._id;
    }

    // 4. Transform and Import Products
    const products = productsData.map((p) => {
      // Handle colors (string to array)
      let colors = [];
      if (typeof p.colors === "string") {
        colors = p.colors
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== "");
      } else if (Array.isArray(p.colors)) {
        colors = p.colors;
      }

      // Handle images (ensure it's an array)
      let images = [];
      if (typeof p.images === "string" && p.images !== "") {
        images = [p.images];
      } else if (Array.isArray(p.images)) {
        images = p.images.filter((img) => img !== "");
      }

      return {
        title: p.title,
        slug: slugify(p.title, { lower: true }),
        description: p.description,
        quantity: p.quantity,
        sold: p.sold || 0,
        price: p.price,
        priceAfterDiscount: p.priceAfterDiscount || undefined,
        colors: colors,
        imageCover: p.imageCover,
        images: images,
        category: categoryMap[p.category],
        brand: brandMap[p.brand],
        ratingsAverage: p.ratingsAverage || 4.5,
        ratingsQuantity: p.ratingsQuantity || 0,
      };
    });

    await Product.create(products);
    console.log("--- Data Successfully Imported! ---");
    process.exit();
  } catch (err) {
    console.error("Error importing data:", err);
    process.exit(1);
  }
};

// Start import
importData();
