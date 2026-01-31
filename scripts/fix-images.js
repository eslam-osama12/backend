const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const Product = require("../models/productModel");

mongoose
  .connect(
    process.env.DATABASE_LOCAL || "mongodb://localhost:27017/ecommerce-db",
  )
  .then(() => console.log("DB Connection successful!"))
  .catch((err) => {
    console.error("DB Connection error:", err);
    process.exit(1);
  });

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Product+Image";

const fixBrokenImages = async () => {
  try {
    const brokenData = JSON.parse(
      fs.readFileSync("broken_images.json", "utf-8"),
    );
    console.log(`Fixing broken images for ${brokenData.length} products...`);

    for (const item of brokenData) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      let updated = false;

      // Check imageCover
      const coverBroken = item.brokenImages.find(
        (img) => img.url === product.imageCover,
      );
      if (coverBroken) {
        product.imageCover = PLACEHOLDER_IMAGE;
        updated = true;
      }

      // Check images array
      const newImages = product.images.map((imgUrl) => {
        const isBroken = item.brokenImages.find(
          (broken) => broken.url === imgUrl,
        );
        if (isBroken) {
          updated = true;
          return PLACEHOLDER_IMAGE;
        }
        return imgUrl;
      });

      if (updated) {
        product.images = newImages;
        await product.save();
        console.log(`Updated images for: ${product.title}`);
      }
    }

    console.log("--- All broken images updated with placeholders! ---");
    process.exit();
  } catch (err) {
    console.error("Error fixing images:", err);
    process.exit(1);
  }
};

fixBrokenImages();
