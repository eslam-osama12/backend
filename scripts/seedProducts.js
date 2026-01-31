const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

// Connect to DB
mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log(`Database Connected: ${conn.connection.host}`);
});

// Read data
const productsData = JSON.parse(
  fs.readFileSync("./products.json", "utf-8"),
).products;

const seedData = async () => {
  try {
    console.log("--- Starting Seeding Process ---");

    const categoriesMap = {};
    const brandsMap = {};

    // 1. Process Categories
    console.log("Seeding Categories...");
    const categoryImages = {
      beauty:
        "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=600",
      fragrances:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
      furniture:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
      groceries:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    };

    const uniqueCategories = [...new Set(productsData.map((p) => p.category))];
    for (const catName of uniqueCategories) {
      const imgUrl =
        categoryImages[catName.toLowerCase()] ||
        `https://placehold.co/600x400?text=${catName}`;
      const category = await Category.findOneAndUpdate(
        { name: catName },
        {
          name: catName,
          slug: slugify(catName, { lower: true }),
          image: imgUrl,
        },
        { upsert: true, new: true },
      );
      categoriesMap[catName] = category._id;
    }

    // 2. Process Brands
    console.log("Seeding Brands...");
    const brandMappings = {
      "Calvin Klein": "https://logo.clearbit.com/calvinklein.com?size=200",
      Chanel: "https://logo.clearbit.com/chanel.com?size=200",
      Dior: "https://logo.clearbit.com/dior.com?size=200",
      "Dolce & Gabbana": "https://logo.clearbit.com/dolcegabbana.com?size=200",
      Gucci: "https://logo.clearbit.com/gucci.com?size=200",
      Essence: "https://logo.clearbit.com/essence.eu?size=200",
      Knoll: "https://logo.clearbit.com/knoll.com?size=200",
      "Annibale Colombo":
        "https://annibalecolombo.it/wp-content/uploads/2019/12/logo-annibale-colombo.png",
      "Bath Trends": "https://logo.clearbit.com/bathtrends.com?size=200",
      "Chic Cosmetics": "https://logo.clearbit.com/chiccosmetics.com?size=200",
      "Glamour Beauty":
        "https://images.unsplash.com/photo-1512496011212-32ac30bc1bb6?auto=format&fit=crop&q=80&w=200",
      "Nail Couture": "https://logo.clearbit.com/nailcouture.com?size=200",
      "Velvet Touch":
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=200",
      "Furniture Co.":
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=200",
    };

    const uniqueBrands = [
      ...new Set(productsData.map((p) => p.brand).filter(Boolean)),
    ];
    for (const brandName of uniqueBrands) {
      const imgUrl =
        brandMappings[brandName] ||
        `https://logo.clearbit.com/${brandName.toLowerCase().replace(/\s+/g, "")}.com?size=200`;
      const brand = await Brand.findOneAndUpdate(
        { name: brandName },
        {
          name: brandName,
          slug: slugify(brandName, { lower: true }),
          image: imgUrl,
        },
        { upsert: true, new: true },
      );
      brandsMap[brandName] = brand._id;
    }

    // 3. Process Products
    console.log("Seeding Products...");
    const formattedProducts = productsData.map((p) => {
      const price = p.price || 0;
      const discount = p.discountPercentage || 0;
      const priceAfterDiscount = parseFloat(
        (price - (price * discount) / 100).toFixed(2),
      );

      return {
        title: p.title,
        slug: slugify(p.title, { lower: true }),
        description: p.description,
        quantity: p.stock || 0,
        price: price,
        priceAfterDiscount: priceAfterDiscount,
        imageCover: p.thumbnail,
        images: p.images || [],
        category: categoriesMap[p.category],
        brand: p.brand ? brandsMap[p.brand] : undefined,
        ratingsAverage: p.rating || 4.5,
        ratingsQuantity: p.reviews ? p.reviews.length : 0,
      };
    });

    for (const product of formattedProducts) {
      await Product.findOneAndUpdate({ title: product.title }, product, {
        upsert: true,
        new: true,
      });
    }

    console.log("--- Seeding/Update Successful! ---");
    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedData();
