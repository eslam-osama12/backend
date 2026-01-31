const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");
const csvParser = require("csv-parser");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

// Category images from Unsplash
const categoryImages = {
  "clothing, shoes & jewelry":
    "https://images.unsplash.com/photo-1445205170230-053b83360050?q=80&w=800",
  "tools & home improvement":
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800",
  electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
  "beauty & personal care":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
  beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
  "sports & outdoors":
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
  "health & household":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800",
  "home & kitchen":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800",
  automotive:
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=800",
  "arts, crafts & sewing":
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
  "grocery & gourmet food":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800",
  "patio, lawn & garden":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800",
  "cell phones & accessories":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
  "video games":
    "https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=800",
  women:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
  men: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800",
};

// Brand logos (using Clearbit or known images)
const brandImages = {
  apple:
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200",
  samsung:
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200",
  sony: "https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?q=80&w=200",
  nike: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200",
  adidas:
    "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=200",
  braun: "https://logo.clearbit.com/braun.com?size=200",
  loreal: "https://logo.clearbit.com/loreal.com?size=200",
  "l-oreal": "https://logo.clearbit.com/loreal.com?size=200",
  ikea: "https://logo.clearbit.com/ikea.com?size=200",
  saucony: "https://logo.clearbit.com/saucony.com?size=200",
  kishigo: "https://logo.clearbit.com/kishigo.com?size=200",
  twinsluxes:
    "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=200",
  accutire: "https://logo.clearbit.com/accutire.com?size=200",
  kasott:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200",
  "bio-oil": "https://logo.clearbit.com/bio-oil.com?size=200",
  crysting:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=200",
  ridgid: "https://logo.clearbit.com/ridgid.com?size=200",
  "core 10":
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=200",
  "barney butter": "https://logo.clearbit.com/barneybutter.com?size=200",
  eksa: "https://logo.clearbit.com/eksaudio.com?size=200",
  loogu:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200",
  pulote:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=200",
  stahlwille: "https://logo.clearbit.com/stahlwille.de?size=200",
  cell9102:
    "https://images.unsplash.com/photo-1609695584612-fe2a6c52bbea?q=80&w=200",
  "general tools": "https://logo.clearbit.com/generaltools.com?size=200",
  "daniel smith": "https://logo.clearbit.com/danielsmith.com?size=200",
  nznd: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=200",
  dingo: "https://logo.clearbit.com/dingo-boots.com?size=200",
  "nature's answer": "https://logo.clearbit.com/naturesanswer.com?size=200",
  ftl: "https://images.unsplash.com/photo-1558005137-d9619a5c539f?q=80&w=200",
  "h heshecein":
    "https://images.unsplash.com/photo-1592853598064-a8356e3e4c60?q=80&w=200",
  koolertron: "https://logo.clearbit.com/koolertron.com?size=200",
  "signature fitness":
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200",
  art3d: "https://logo.clearbit.com/art3d.com?size=200",
  fantpk:
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=200",
  "p&g professional": "https://logo.clearbit.com/pg.com?size=200",
  olight: "https://logo.clearbit.com/olightstore.com?size=200",
  swanson: "https://logo.clearbit.com/swansonvitamins.com?size=200",
  "aqua select":
    "https://images.unsplash.com/photo-1576610616656-d3a19c3253b1?q=80&w=200",
  "saura life science":
    "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=200",
};

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Database Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`Database Error: ${err}`);
    process.exit(1);
  }
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === "null" || priceStr === "") return null;
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
};

const extractRootCategory = (categoriesStr) => {
  try {
    if (!categoriesStr || categoriesStr === "") return null;
    const categories = JSON.parse(categoriesStr.replace(/""/g, '"'));
    if (Array.isArray(categories) && categories.length > 0) {
      return categories[0]; // Get root category
    }
  } catch (e) {
    // Try to extract first category from malformed format
    const match = categoriesStr.match(/"([^"]+)"/);
    if (match) return match[1];
  }
  return null;
};

const getCategoryImage = (categoryName) => {
  const key = categoryName.toLowerCase();
  if (categoryImages[key]) return categoryImages[key];

  // Try partial matching
  for (const [k, v] of Object.entries(categoryImages)) {
    if (key.includes(k) || k.includes(key)) return v;
  }

  return `https://placehold.co/800x600?text=${encodeURIComponent(categoryName)}`;
};

const getBrandImage = (brandName) => {
  if (!brandName) return null;
  const key = brandName.toLowerCase();

  if (brandImages[key]) return brandImages[key];

  // Try Clearbit logo
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://logo.clearbit.com/${cleanName}.com?size=200`;
};

const truncateTitle = (title, maxLength = 100) => {
  if (!title) return "Product";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + "...";
};

const ensureMinDescription = (desc, minLength = 20) => {
  if (!desc || desc.length < minLength) {
    return "High-quality product with excellent features and reliable performance. Satisfaction guaranteed.";
  }
  return desc;
};

const seedData = async () => {
  try {
    console.log("--- Starting CSV Import ---\n");

    // Parse CSV
    console.log("📄 Parsing CSV file...");
    const csvPath = "./amazon-products.csv";
    const rawProducts = await parseCSV(csvPath);
    console.log(`   Found ${rawProducts.length} products in CSV\n`);

    // Extract unique categories
    console.log("📁 Processing Categories...");
    const uniqueCategories = new Set();
    rawProducts.forEach((p) => {
      const cat = extractRootCategory(p.categories);
      if (cat) uniqueCategories.add(cat);
    });
    console.log(`   Found ${uniqueCategories.size} unique categories`);

    // Extract unique brands
    console.log("🏷️  Processing Brands...");
    const uniqueBrands = new Set();
    rawProducts.forEach((p) => {
      if (p.brand && p.brand.trim()) uniqueBrands.add(p.brand.trim());
    });
    console.log(`   Found ${uniqueBrands.size} unique brands\n`);

    // Create categories
    console.log("💾 Creating Categories in Database...");
    const categoriesMap = {};
    for (const catName of uniqueCategories) {
      const image = getCategoryImage(catName);
      const category = await Category.findOneAndUpdate(
        { name: catName },
        {
          name: catName,
          slug: slugify(catName, { lower: true, strict: true }),
          image: image,
        },
        { upsert: true, new: true },
      );
      categoriesMap[catName] = category._id;
      console.log(`   ✓ ${catName}`);
    }

    // Create brands
    console.log("\n💾 Creating Brands in Database...");
    const brandsMap = {};
    for (const brandName of uniqueBrands) {
      // Truncate brand name to 32 chars max
      const truncatedName =
        brandName.length > 32 ? brandName.substring(0, 32) : brandName;
      const image = getBrandImage(brandName);
      try {
        const brand = await Brand.findOneAndUpdate(
          { name: truncatedName },
          {
            name: truncatedName,
            slug: slugify(truncatedName, { lower: true, strict: true }),
            image: image,
          },
          { upsert: true, new: true },
        );
        brandsMap[brandName] = brand._id;
        console.log(`   ✓ ${truncatedName}`);
      } catch (err) {
        console.log(`   ⚠ Skipping brand: ${truncatedName} (${err.message})`);
      }
    }

    // Create products
    console.log("\n💾 Creating Products in Database...");
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < rawProducts.length; i++) {
      const p = rawProducts[i];

      try {
        const categoryName = extractRootCategory(p.categories);
        if (!categoryName || !categoriesMap[categoryName]) {
          skipCount++;
          continue;
        }

        const title = truncateTitle(p.title);
        const description = ensureMinDescription(p.description);
        const initialPrice = parsePrice(p.initial_price);
        const finalPrice = parsePrice(p.final_price);
        const price = finalPrice || initialPrice || 99.99;
        const priceAfterDiscount =
          finalPrice && initialPrice && finalPrice < initialPrice
            ? finalPrice
            : undefined;

        // Get image
        let imageCover = p.image_url || "";
        if (!imageCover || imageCover === "") {
          imageCover = getCategoryImage(categoryName);
        }

        // Parse images array
        let images = [];
        try {
          if (p.images && p.images !== "null") {
            const parsed = JSON.parse(p.images.replace(/""/g, '"'));
            if (Array.isArray(parsed)) {
              images = parsed.slice(0, 5); // Max 5 images
            }
          }
        } catch (e) {
          images = [imageCover];
        }

        const rating = parseFloat(p.rating) || 4.5;
        const reviewsCount = parseInt(p.reviews_count) || 0;

        const productData = {
          title: title,
          slug: slugify(title + "-" + Date.now() + "-" + i, {
            lower: true,
            strict: true,
          }),
          description: description,
          quantity: Math.floor(Math.random() * 450) + 50,
          sold: Math.floor(Math.random() * 100),
          price: price > 200000 ? 199999 : price,
          priceAfterDiscount: priceAfterDiscount,
          colors: ["Black", "White", "Blue"].slice(
            0,
            Math.floor(Math.random() * 3) + 1,
          ),
          imageCover: imageCover,
          images: images.length > 0 ? images : [imageCover],
          category: categoriesMap[categoryName],
          brand: p.brand && brandsMap[p.brand] ? brandsMap[p.brand] : undefined,
          ratingsAverage: rating > 5 ? 5 : rating < 1 ? 4.5 : rating,
          ratingsQuantity: reviewsCount,
        };

        await Product.create(productData);
        successCount++;

        if ((i + 1) % 100 === 0) {
          console.log(
            `   Processed ${i + 1}/${rawProducts.length} products...`,
          );
        }
      } catch (err) {
        skipCount++;
        if (err.code !== 11000) {
          // Skip duplicate key errors silently
          console.log(`   ⚠ Error on product ${i}: ${err.message}`);
        }
      }
    }

    console.log(`\n✅ Successfully imported ${successCount} products!`);
    console.log(
      `⚠  Skipped ${skipCount} products due to missing data or errors.\n`,
    );

    console.log("--- Import Complete ---");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

dbConnection().then(() => seedData());
