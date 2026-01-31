const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

// All brands using placehold.co - guaranteed to work
const brandLogos = {
  BIC: "https://placehold.co/200x200/FF6600/ffffff?text=BIC&font=roboto",
  "Elmer's":
    "https://placehold.co/200x200/FF0000/ffffff?text=ELMERS&font=roboto",
  "VELCRO Brand":
    "https://placehold.co/200x200/000000/ffffff?text=VELCRO&font=roboto",
  KNIPEX: "https://placehold.co/200x200/CC0000/ffffff?text=KNIPEX&font=roboto",
  "Rust-Oleum":
    "https://placehold.co/200x200/8B4513/ffffff?text=RUST-OLEUM&font=roboto",
  "Honeywell Safety Products, USA":
    "https://placehold.co/200x200/DC143C/ffffff?text=HONEYWELL&font=roboto",
  Kobo: "https://placehold.co/200x200/00A3E0/ffffff?text=KOBO&font=roboto",
  ARTEZA: "https://placehold.co/200x200/FF4500/ffffff?text=ARTEZA&font=roboto",
  "Natural Factors":
    "https://placehold.co/200x200/228B22/ffffff?text=NATURAL+FACTORS&font=roboto",
  "Madison Park":
    "https://placehold.co/200x200/4B0082/ffffff?text=MADISON+PARK&font=roboto",
  Weruva: "https://placehold.co/200x200/DAA520/ffffff?text=WERUVA&font=roboto",
  "Zak Designs":
    "https://placehold.co/200x200/1E90FF/ffffff?text=ZAK+DESIGNS&font=roboto",
  "Bare Home":
    "https://placehold.co/200x200/2F4F4F/ffffff?text=BARE+HOME&font=roboto",
  "HLC.ME":
    "https://placehold.co/200x200/8B008B/ffffff?text=HLC.ME&font=roboto",
  Powerbuilt:
    "https://placehold.co/200x200/B22222/ffffff?text=POWERBUILT&font=roboto",
  "EURO TOOL":
    "https://placehold.co/200x200/FFD700/000000?text=EURO+TOOL&font=roboto",
  Duralex:
    "https://placehold.co/200x200/006400/ffffff?text=DURALEX&font=roboto",
  Eurmax: "https://placehold.co/200x200/4682B4/ffffff?text=EURMAX&font=roboto",
  "Nordic Pure":
    "https://placehold.co/200x200/00CED1/ffffff?text=NORDIC+PURE&font=roboto",
  HONEST: "https://placehold.co/200x200/20B2AA/ffffff?text=HONEST&font=roboto",
  SOLE: "https://placehold.co/200x200/708090/ffffff?text=SOLE&font=roboto",
  "Groupe SEB":
    "https://placehold.co/200x200/FF4500/ffffff?text=GROUPE+SEB&font=roboto",
  Bavilk: "https://placehold.co/200x200/1a73e8/ffffff?text=BAVILK&font=roboto",
  HOMEK: "https://placehold.co/200x200/e91e63/ffffff?text=HOMEK&font=roboto",
  BFJLIFE:
    "https://placehold.co/200x200/9c27b0/ffffff?text=BFJLIFE&font=roboto",
  Loyanyy:
    "https://placehold.co/200x200/4caf50/ffffff?text=LOYANYY&font=roboto",
  iGrow: "https://placehold.co/200x200/8bc34a/ffffff?text=iGROW&font=roboto",
  Spoontiques:
    "https://placehold.co/200x200/ff5722/ffffff?text=SPOONTIQUES&font=roboto",
  Wonesifee:
    "https://placehold.co/200x200/673ab7/ffffff?text=WONESIFEE&font=roboto",
  KOAKOMI:
    "https://placehold.co/200x200/3f51b5/ffffff?text=KOAKOMI&font=roboto",
  KIRKAS: "https://placehold.co/200x200/009688/ffffff?text=KIRKAS&font=roboto",
  PUROFLO:
    "https://placehold.co/200x200/2196f3/ffffff?text=PUROFLO&font=roboto",
  BIDEN: "https://placehold.co/200x200/1565c0/ffffff?text=BIDEN&font=roboto",
  FBLFOBELI:
    "https://placehold.co/200x200/d32f2f/ffffff?text=FBLFOBELI&font=roboto",
  Gowithwind:
    "https://placehold.co/200x200/43a047/ffffff?text=GOWITHWIND&font=roboto",
  WURAWUS:
    "https://placehold.co/200x200/7b1fa2/ffffff?text=WURAWUS&font=roboto",
  Mudder: "https://placehold.co/200x200/5d4037/ffffff?text=MUDDER&font=roboto",
  Huk: "https://placehold.co/200x200/0288d1/ffffff?text=HUK&font=roboto",
  SOLEDI: "https://placehold.co/200x200/512da8/ffffff?text=SOLEDI&font=roboto",
  Vesgantti:
    "https://placehold.co/200x200/6a1b9a/ffffff?text=VESGANTTI&font=roboto",
  Honghao:
    "https://placehold.co/200x200/c62828/ffffff?text=HONGHAO&font=roboto",
  Naiveer:
    "https://placehold.co/200x200/00838f/ffffff?text=NAIVEER&font=roboto",
  "Barn Eleven":
    "https://placehold.co/200x200/6d4c41/ffffff?text=BARN+ELEVEN&font=roboto",
  Jueison:
    "https://placehold.co/200x200/4527a0/ffffff?text=JUEISON&font=roboto",
  Zeerkeer:
    "https://placehold.co/200x200/00695c/ffffff?text=ZEERKEER&font=roboto",
  "LIGHT FLIGHT":
    "https://placehold.co/200x200/ffa000/000000?text=LIGHT+FLIGHT&font=roboto",
  Ltinist:
    "https://placehold.co/200x200/7c4dff/ffffff?text=LTINIST&font=roboto",
  "Allstar Innovations":
    "https://placehold.co/200x200/f57c00/ffffff?text=ALLSTAR&font=roboto",
  Mustaches:
    "https://placehold.co/200x200/37474f/ffffff?text=MUSTACHES&font=roboto",
  Sumind: "https://placehold.co/200x200/00acc1/ffffff?text=SUMIND&font=roboto",
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

const updateBrandLogos = async () => {
  try {
    console.log("--- Updating All Brand Logos with placehold.co ---\n");

    const brands = await Brand.find();
    console.log(`Found ${brands.length} brands to update\n`);

    let updated = 0;
    for (const brand of brands) {
      const logo = brandLogos[brand.name];
      if (logo) {
        await Brand.updateOne({ _id: brand._id }, { image: logo });
        console.log(`✓ ${brand.name}`);
        updated++;
      } else {
        // Generate fallback with placehold.co
        const encodedName = encodeURIComponent(
          brand.name.substring(0, 12).toUpperCase(),
        );
        const colors = [
          "1a73e8",
          "e91e63",
          "4caf50",
          "ff9800",
          "9c27b0",
          "00bcd4",
          "f44336",
          "795548",
          "607d8b",
          "673ab7",
        ];
        const color = colors[updated % colors.length];
        const fallbackLogo = `https://placehold.co/200x200/${color}/ffffff?text=${encodedName}&font=roboto`;
        await Brand.updateOne({ _id: brand._id }, { image: fallbackLogo });
        console.log(`✓ ${brand.name} (generated)`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated}/${brands.length} brand logos!`);
    console.log("All logos now use placehold.co (guaranteed to work)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

dbConnection().then(() => updateBrandLogos());
