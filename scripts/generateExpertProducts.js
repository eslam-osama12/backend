const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

dotenv.config({ path: "config.env" });

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Database Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`Database Error: ${err}`);
    process.exit(1);
  }
};

const categoriesData = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
    nouns: [
      "Smartphone",
      "Laptop",
      "Headphones",
      "Watch",
      "Tablet",
      "Camera",
      "Speaker",
      "Monitor",
      "Keyboard",
      "Drone",
    ],
    brands: [
      "Lumina Tech",
      "NexaCore",
      "VoltEdge",
      "Horizon Systems",
      "PureAudio",
    ],
    priceRange: [100, 2000],
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=800",
    nouns: [
      "T-Shirt",
      "Jeans",
      "Jacket",
      "Dress",
      "Sneakers",
      "Watch",
      "Handbag",
      "Sunglasses",
      "Scarf",
      "Belt",
    ],
    brands: [
      "Arise Apparel",
      "Modura",
      "UrbanStitch",
      "Velvet Rose",
      "Ethos Wear",
    ],
    priceRange: [20, 300],
  },
  {
    name: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800",
    nouns: [
      "Chair",
      "Table",
      "Lamp",
      "Vase",
      "Rug",
      "Sofa",
      "Clock",
      "Curtain",
      "Mirror",
      "Shelf",
    ],
    brands: [
      "Hearth & Stone",
      "Nestly",
      "Aurora Home",
      "Oak & Iron",
      "ZenSpace",
    ],
    priceRange: [50, 1500],
  },
  {
    name: "Health",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    nouns: [
      "Vitamin C",
      "Omega 3",
      "Yoga Mat",
      "Protein Powder",
      "Dumbbell",
      "Massager",
      "Essential Oil",
      "First Aid Kit",
      "Thermometer",
      "Scale",
    ],
    brands: ["VitalPulse", "PurePath", "TerraCure", "BioBalance", "LifeSync"],
    priceRange: [10, 200],
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
    nouns: [
      "Running Shoes",
      "Backpack",
      "Water Bottle",
      "Tent",
      "Bicycle",
      "Goggles",
      "Racket",
      "Helmet",
      "Gloves",
      "Jersey",
    ],
    brands: [
      "Peak Performance",
      "AeroGear",
      "IronStride",
      "AquaPro",
      "TrailBlaze",
    ],
    priceRange: [15, 1000],
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
    nouns: [
      "Lipstick",
      "Moisturizer",
      "Serum",
      "Mascara",
      "Foundation",
      "Perfume",
      "Cleanser",
      "Toner",
      "Shampoo",
      "Conditioner",
    ],
    brands: [
      "GlowRite",
      "Essence Aura",
      "Silk & Soul",
      "Velvet Gloss",
      "Radiant Skin",
    ],
    priceRange: [10, 150],
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800",
    nouns: [
      "Novel",
      "Biography",
      "Cookbook",
      "Journal",
      "Encyclopedia",
      "Comic Book",
      "Guidebook",
      "Anthology",
      "Textbook",
      "Notebook",
    ],
    brands: [
      "Chronicle Press",
      "Ink & Parchment",
      "Legacy Reads",
      "Modern Myth",
      "Scribe Haven",
    ],
    priceRange: [5, 100],
  },
  {
    name: "Toys",
    image:
      "https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=800",
    nouns: [
      "Action Figure",
      "Puzzle",
      "Board Game",
      "Doll",
      "Remote Control Car",
      "Building Blocks",
      "Plush Toy",
      "Art Set",
      "Train Set",
      "Kite",
    ],
    brands: [
      "PlayQuest",
      "WonderWorks",
      "BuildAWorld",
      "TinyAdventurers",
      "KiddoCraft",
    ],
    priceRange: [5, 200],
  },
  {
    name: "Pet Supplies",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800",
    nouns: [
      "Dog Food",
      "Cat Litter",
      "Leash",
      "Pet Bed",
      "Aquarium",
      "Bird Cage",
      "Chew Toy",
      "Scratching Post",
      "Brush",
      "Carrying Case",
    ],
    brands: [
      "Paws & Claws",
      "TailWag",
      "FurryFriends",
      "PetZen",
      "WildHeritage",
    ],
    priceRange: [5, 300],
  },
  {
    name: "Office",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800",
    nouns: [
      "Pen Set",
      "Planner",
      "Stapler",
      "Paper Shredder",
      "Desk Organizer",
      "File Folder",
      "Glue Stick",
      "Whiteboard",
      "Calculator",
      "Pointer",
    ],
    brands: ["DeskMate", "ProFlow", "SigmaWrite", "CraftStation", "PivotPoint"],
    priceRange: [2, 500],
  },
];

const descriptors = [
  "Premium Professional",
  "Ultra Durable",
  "Sleek Modern",
  "Eco-Friendly",
  "Compact Portable",
  "High-Performance",
  "Advanced Smart",
  "Classic Vintage",
  "Luxury Handcrafted",
  "Versatile All-Day",
];

const features = [
  "with enhanced features",
  "designed for comfort",
  "built to last",
  "perfect for daily use",
  "with innovative design",
  "offering superior quality",
  "maximum efficiency",
  "lightweight and strong",
  "ergonomically designed",
  "water-resistant",
];

const colors = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Silver",
  "Gold",
  "Navy",
  "Gray",
  "Teal",
];

const deleteData = async () => {
  try {
    console.log("Clearing database...");
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    console.log("Database cleared!");
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

const generateProducts = async () => {
  try {
    await dbConnection();
    await deleteData();

    console.log("Seeding categories and brands...");
    const categoriesMap = {};
    const brandsMap = {};

    for (const catData of categoriesData) {
      const category = await Category.create({
        name: catData.name,
        slug: slugify(catData.name, { lower: true }),
        image: catData.image,
      });
      categoriesMap[catData.name] = category;

      for (const brandName of catData.brands) {
        const brand = await Brand.create({
          name: brandName,
          slug: slugify(brandName, { lower: true }),
          image: catData.image, // Using category image as placeholder for brand
        });
        brandsMap[brandName] = brand;
      }
    }

    console.log("Generating 1000 unique products...");
    const products = [];
    const usedTitles = new Set();

    while (products.length < 1000) {
      const catData =
        categoriesData[Math.floor(Math.random() * categoriesData.length)];
      const noun =
        catData.nouns[Math.floor(Math.random() * catData.nouns.length)];
      const brandName =
        catData.brands[Math.floor(Math.random() * catData.brands.length)];
      const descriptor =
        descriptors[Math.floor(Math.random() * descriptors.length)];
      const feature = features[Math.floor(Math.random() * features.length)];

      const title = `${brandName} ${descriptor} ${noun} ${products.length + 1}`;

      if (!usedTitles.has(title)) {
        usedTitles.add(title);

        const category = categoriesMap[catData.name];
        const brand = brandsMap[brandName];

        const minPrice = catData.priceRange[0];
        const maxPrice = catData.priceRange[1];
        const price =
          Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
        const discount =
          Math.random() > 0.8 ? Math.floor(price * 0.9) : undefined;

        products.push({
          title: title,
          slug: slugify(title, { lower: true }),
          description: `${title} is a ${descriptor.toLowerCase()} ${noun.toLowerCase()} ${feature}. This high-quality product from ${brandName} is specifically designed for customers who appreciate quality and durability in the ${catData.name} category. It measures up to the highest standards of the industry.`,
          quantity: Math.floor(Math.random() * 500) + 10,
          sold: Math.floor(Math.random() * 100),
          price: price,
          priceAfterDiscount: discount,
          colors: colors.slice(0, Math.floor(Math.random() * 4) + 1),
          imageCover: catData.image,
          images: [catData.image, catData.image],
          category: category._id,
          brand: brand._id,
          ratingsAverage: (Math.random() * 1.5 + 3.5).toFixed(1),
          ratingsQuantity: Math.floor(Math.random() * 300) + 1,
        });
      }
    }

    console.log("Inserting products into database...");
    await Product.insertMany(products);
    console.log(
      `Successfully seeded EXACTLY ${products.length} unique products!`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

generateProducts();
