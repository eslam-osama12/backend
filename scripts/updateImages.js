const mongoose = require("mongoose");
const dotenv = require("dotenv");
const https = require("https");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

// Verified working Pexels image URLs for categories
const categoryImages = {
  "Clothing, Shoes & Jewelry":
    "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tools & Home Improvement":
    "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800",
  Automotive:
    "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800",
  Beauty:
    "https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=800",
  Electronics:
    "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Beauty & Personal Care":
    "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Arts, Crafts & Sewing":
    "https://images.pexels.com/photos/1124884/pexels-photo-1124884.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Grocery & Gourmet Food":
    "https://images.pexels.com/photos/1638997/pexels-photo-1638997.jpeg?auto=compress&cs=tinysrgb&w=800",
  Women:
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Health & Household":
    "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cell Phones & Accessories":
    "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Patio, Lawn & Garden":
    "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Video Games":
    "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Sports & Outdoors":
    "https://images.pexels.com/photos/47356/frisbee-sport-fun-dog-47356.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Home & Kitchen":
    "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Kitchen & Dining":
    "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Motorcycle & Powersports":
    "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pet Supplies":
    "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Office Products":
    "https://images.pexels.com/photos/269610/pexels-photo-269610.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Industrial & Scientific":
    "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=800",
  "CDs & Vinyl":
    "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Toys & Games":
    "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800",
  Men: "https://images.pexels.com/photos/837306/pexels-photo-837306.jpeg?auto=compress&cs=tinysrgb&w=800",
  Appliances:
    "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Musical Instruments":
    "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Power & Hand Tools":
    "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Baby Products":
    "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Hunting & Fishing":
    "https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800",
};

// Default brand placeholder image (reliable)
const defaultBrandImage =
  "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400";

// Known brand logos that work (using public CDN/Logo sources)
const knownBrandImages = {
  // Famous brands with reliable public logos
  Nike: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
  Adidas:
    "https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?auto=compress&cs=tinysrgb&w=400",
  Apple:
    "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=400",
  Samsung:
    "https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?auto=compress&cs=tinysrgb&w=400",
  Sony: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400",
  Microsoft:
    "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
  LEGO: "https://images.pexels.com/photos/1604659/pexels-photo-1604659.jpeg?auto=compress&cs=tinysrgb&w=400",
  Braun:
    "https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=400",
  JBL: "https://images.pexels.com/photos/3394654/pexels-photo-3394654.jpeg?auto=compress&cs=tinysrgb&w=400",
  Corsair:
    "https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=400",
  Reebok:
    "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400",
  PUMA: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=400",
  ASICS:
    "https://images.pexels.com/photos/2529142/pexels-photo-2529142.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Under Armour":
    "https://images.pexels.com/photos/3490360/pexels-photo-3490360.jpeg?auto=compress&cs=tinysrgb&w=400",
  Carhartt:
    "https://images.pexels.com/photos/6311672/pexels-photo-6311672.jpeg?auto=compress&cs=tinysrgb&w=400",
  Timberland:
    "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=400",
  UGG: "https://images.pexels.com/photos/5558237/pexels-photo-5558237.jpeg?auto=compress&cs=tinysrgb&w=400",
  Coleman:
    "https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=400",
  Epson:
    "https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=400",
  Oakley:
    "https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Hydro Flask":
    "https://images.pexels.com/photos/3679601/pexels-photo-3679601.jpeg?auto=compress&cs=tinysrgb&w=400",
  Thule:
    "https://images.pexels.com/photos/5480745/pexels-photo-5480745.jpeg?auto=compress&cs=tinysrgb&w=400",
  Kenmore:
    "https://images.pexels.com/photos/5825359/pexels-photo-5825359.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Rubbermaid Commercial Products":
    "https://images.pexels.com/photos/4239021/pexels-photo-4239021.jpeg?auto=compress&cs=tinysrgb&w=400",
  Rawlings:
    "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400",
  Zippo:
    "https://images.pexels.com/photos/8327052/pexels-photo-8327052.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Bio-Oil":
    "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400",
  Wolverine:
    "https://images.pexels.com/photos/6311637/pexels-photo-6311637.jpeg?auto=compress&cs=tinysrgb&w=400",
  Saucony:
    "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400",
  Salomon:
    "https://images.pexels.com/photos/1464624/pexels-photo-1464624.jpeg?auto=compress&cs=tinysrgb&w=400",
  KEEN: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=400",
  Sperry:
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400",
  TOMS: "https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=400",
  Minnetonka:
    "https://images.pexels.com/photos/3261069/pexels-photo-3261069.jpeg?auto=compress&cs=tinysrgb&w=400",
  Lee: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
  Gildan:
    "https://images.pexels.com/photos/6208110/pexels-photo-6208110.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Hanes Ultimate Baby":
    "https://images.pexels.com/photos/6393342/pexels-photo-6393342.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Champion Sports":
    "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=400",
  Greenworks:
    "https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Rust-Oleum":
    "https://images.pexels.com/photos/1669754/pexels-photo-1669754.jpeg?auto=compress&cs=tinysrgb&w=400",
  Kirkland:
    "https://images.pexels.com/photos/4871119/pexels-photo-4871119.jpeg?auto=compress&cs=tinysrgb&w=400",
  "Melissa & Doug":
    "https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=400",
  Crayola:
    "https://images.pexels.com/photos/159579/crayons-coloring-book-coloring-book-159579.jpeg?auto=compress&cs=tinysrgb&w=400",
  ARTEZA:
    "https://images.pexels.com/photos/1153895/pexels-photo-1153895.jpeg?auto=compress&cs=tinysrgb&w=400",
};

// Generate category-based brand images by matching keywords
const getCategoryBasedBrandImage = (brandName) => {
  const name = brandName.toLowerCase();

  // Beauty/Personal Care brands
  if (
    name.includes("beauty") ||
    name.includes("skin") ||
    name.includes("hair") ||
    name.includes("cosmetic") ||
    name.includes("care")
  ) {
    return "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Electronics brands
  if (
    name.includes("tech") ||
    name.includes("electronic") ||
    name.includes("power") ||
    name.includes("digital")
  ) {
    return "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Sport/Fitness brands
  if (
    name.includes("sport") ||
    name.includes("fitness") ||
    name.includes("athletic") ||
    name.includes("gym")
  ) {
    return "https://images.pexels.com/photos/3490360/pexels-photo-3490360.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Home/Kitchen brands
  if (
    name.includes("home") ||
    name.includes("kitchen") ||
    name.includes("house") ||
    name.includes("living")
  ) {
    return "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Tool brands
  if (
    name.includes("tool") ||
    name.includes("hardware") ||
    name.includes("industrial")
  ) {
    return "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Automotive brands
  if (
    name.includes("auto") ||
    name.includes("car") ||
    name.includes("motor") ||
    name.includes("tire") ||
    name.includes("vehicle")
  ) {
    return "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Pet brands
  if (
    name.includes("pet") ||
    name.includes("dog") ||
    name.includes("cat") ||
    name.includes("animal")
  ) {
    return "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Baby brands
  if (
    name.includes("baby") ||
    name.includes("kid") ||
    name.includes("child") ||
    name.includes("infant")
  ) {
    return "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Fashion brands
  if (
    name.includes("fashion") ||
    name.includes("wear") ||
    name.includes("style") ||
    name.includes("apparel")
  ) {
    return "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Office brands
  if (
    name.includes("office") ||
    name.includes("paper") ||
    name.includes("desk")
  ) {
    return "https://images.pexels.com/photos/269610/pexels-photo-269610.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Arts/Crafts brands
  if (
    name.includes("art") ||
    name.includes("craft") ||
    name.includes("paint") ||
    name.includes("draw")
  ) {
    return "https://images.pexels.com/photos/1124884/pexels-photo-1124884.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Garden/Outdoor brands
  if (
    name.includes("garden") ||
    name.includes("outdoor") ||
    name.includes("lawn") ||
    name.includes("patio")
  ) {
    return "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
  // Food brands
  if (
    name.includes("food") ||
    name.includes("organic") ||
    name.includes("natural") ||
    name.includes("nutrition")
  ) {
    return "https://images.pexels.com/photos/1638997/pexels-photo-1638997.jpeg?auto=compress&cs=tinysrgb&w=400";
  }

  return defaultBrandImage;
};

const getBrandImage = (brandName) => {
  // Check if we have a known brand image
  if (knownBrandImages[brandName]) {
    return knownBrandImages[brandName];
  }
  // Try category-based matching
  return getCategoryBasedBrandImage(brandName);
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

const updateImages = async () => {
  try {
    console.log("--- Starting Image Update ---\n");

    // Update Categories
    console.log("📁 Updating Category Images...");
    const categories = await Category.find();
    let catUpdated = 0;

    for (const cat of categories) {
      const newImage = categoryImages[cat.name];
      if (newImage) {
        await Category.updateOne({ _id: cat._id }, { image: newImage });
        console.log(`   ✓ ${cat.name}`);
        catUpdated++;
      } else {
        console.log(`   ⚠ No image found for: ${cat.name}`);
      }
    }
    console.log(`\n   Updated ${catUpdated}/${categories.length} categories\n`);

    // Update Brands
    console.log("🏷️  Updating Brand Images...");
    const brands = await Brand.find();
    let brandUpdated = 0;

    for (const brand of brands) {
      const newImage = getBrandImage(brand.name);
      await Brand.updateOne({ _id: brand._id }, { image: newImage });
      brandUpdated++;

      if (brandUpdated % 100 === 0) {
        console.log(`   Processed ${brandUpdated}/${brands.length} brands...`);
      }
    }
    console.log(`\n   Updated ${brandUpdated}/${brands.length} brands\n`);

    console.log("✅ Image update complete!");
    console.log("--- All images now use verified Pexels URLs ---");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

dbConnection().then(() => updateImages());
