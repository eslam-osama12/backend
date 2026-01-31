const fs = require("fs");
const mongoose = require("mongoose");
const axios = require("axios");
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

const checkImage = async (url) => {
  if (!url || typeof url !== "string" || url === "")
    return { url, status: "MISSING" };
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return { url, status: response.status === 200 ? "OK" : response.status };
  } catch (error) {
    return { url, status: "BROKEN", error: error.message };
  }
};

const verifyImages = async () => {
  try {
    const products = await Product.find({}, "title imageCover images");
    console.log(`Verifying images for ${products.length} products...`);

    const results = [];
    for (const product of products) {
      const coverResult = await checkImage(product.imageCover);
      const imagesResults = await Promise.all(
        product.images.map((img) => checkImage(img)),
      );

      const brokenImages = [
        ...(coverResult.status !== "OK" ? [coverResult] : []),
        ...imagesResults.filter((img) => img.status !== "OK"),
      ];

      if (brokenImages.length > 0) {
        results.push({
          productId: product._id,
          title: product.title,
          brokenImages,
        });
      }
    }

    if (results.length > 0) {
      console.log("--- Broken Images Found ---");
      console.log(JSON.stringify(results, null, 2));
      fs.writeFileSync("broken_images.json", JSON.stringify(results, null, 2));
      console.log("Broken images report saved to broken_images.json");
    } else {
      console.log("--- All images are functional! ---");
    }
    process.exit();
  } catch (err) {
    console.error("Error verifying images:", err);
    process.exit(1);
  }
};

verifyImages();
