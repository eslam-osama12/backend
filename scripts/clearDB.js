const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

const clearDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);

    console.log("Deleting all products...");
    await Product.deleteMany();

    console.log("Deleting all categories...");
    await Category.deleteMany();

    console.log("Deleting all brands...");
    await Brand.deleteMany();

    console.log(
      "Cleanup complete: All products, categories, and brands have been removed.",
    );
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDB();
