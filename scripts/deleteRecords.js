const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database Connected...");

    const productsCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const brandsCount = await Brand.countDocuments();

    console.log(
      `Starting deletion: ${productsCount} products, ${categoriesCount} categories, ${brandsCount} brands.`,
    );

    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    console.log("Data successfully deleted!");
    process.exit();
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
};

deleteData();
