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

const data = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
    brands: [
      {
        name: "Apple",
        image:
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200",
      },
      {
        name: "Samsung",
        image:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200",
      },
      {
        name: "Sony",
        image:
          "https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?q=80&w=200",
      },
      {
        name: "Dell",
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=200",
      },
      {
        name: "HP Inc",
        image:
          "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?q=80&w=200",
      },
    ],
    products: [
      {
        title: "iPhone 15 Pro Max",
        description:
          "Experience the ultimate iPhone with a titanium design, A17 Pro chip, and a versatile camera system.",
      },
      {
        title: "MacBook Air M3",
        description:
          "The worlds most popular laptop is better than ever with the M3 chip and a stunning Liquid Retina display.",
      },
      {
        title: "Samsung Galaxy S24 Ultra",
        description:
          "Galaxy S24 Ultra with Galaxy AI, 200MP camera, and built-in S Pen for professional productivity.",
      },
      {
        title: "Sony WH-1000XM5",
        description:
          "Industry-leading noise cancellation and exceptional sound quality in a comfortable, modern design.",
      },
      {
        title: "Sony PlayStation 5",
        description:
          "Experience lightning-fast loading with an ultra-high speed SSD and deeper immersion with haptic feedback.",
      },
      {
        title: "Dell XPS 15",
        description:
          "A powerful laptop with a breathtaking InfinityEdge display and high-performance processors for creators.",
      },
      {
        title: "AirPods Pro 2",
        description:
          "Active Noise Cancellation, Adaptive Transparency, and Personalised Spatial Audio for an immersive experience.",
      },
      {
        title: "Apple Watch Series 9",
        description:
          "A more powerful chip, a brighter display, and the magic of double tap for a seamless experience.",
      },
      {
        title: "Samsung Neo QLED 4K",
        description:
          "Greatness never settles with ultra-fine light control and ultra-powerful AI processing for 4K.",
      },
      {
        title: "iPad Pro M2",
        description:
          "Incredible performance and advanced displays. The ultimate iPad experience with the Apple M2 chip.",
      },
    ],
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=800",
    brands: [
      {
        name: "Nike",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200",
      },
      {
        name: "Adidas",
        image:
          "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=200",
      },
      {
        name: "Zara",
        image:
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=200",
      },
      {
        name: "H&M",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200",
      },
      {
        name: "Gucci",
        image:
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=200",
      },
    ],
    products: [
      {
        title: "Nike Air Force 1",
        description:
          "The legend lives on in the Nike Air Force 1, which stays true to its roots with iconic style.",
      },
      {
        title: "Adidas Ultraboost Light",
        description:
          "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever made.",
      },
      {
        title: "Zara Leather Jacket",
        description:
          "Classic faux leather jacket with lapel collar and long sleeves. Multi-pocket design with metal zips.",
      },
      {
        title: "H&M Cotton Over Shirt",
        description:
          "Straight-cut overshirt in thick cotton twill with a collar, buttons down the front and chest pockets.",
      },
      {
        title: "Nike Dri-FIT T-Shirt",
        description:
          "Built for performance, this moisture-wicking tee keeps you dry and comfortable during workouts.",
      },
      {
        title: "Adidas Samba OG",
        description:
          "A street-style icon born on the pitch, the Samba features premium leather and a gum rubber sole.",
      },
      {
        title: "Gucci Horsebit Loafers",
        description:
          "A classic Gucci design, these loafers are crafted from high-quality leather with signature hardware.",
      },
      {
        title: "Nike Tech Fleece Hoodie",
        description:
          "Premium, lightweight fleece—smooth both inside and out—gives you plenty of warmth without adding bulk.",
      },
      {
        title: "Adidas Tiro Pants",
        description:
          "A football staple turned streetwear classic, these tapered pants are built for comfort and style.",
      },
      {
        title: "Zara Slim Fit Jeans",
        description:
          "Five-pocket jeans made of slightly stretchy denim for a comfortable yet tailored fit.",
      },
    ],
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800",
    brands: [
      {
        name: "IKEA",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200",
      },
      {
        name: "Nespresso",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200",
      },
      {
        name: "KitchenAid",
        image:
          "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=200",
      },
      {
        name: "Philips",
        image:
          "https://images.unsplash.com/photo-1585915551322-90176fb97334?q=80&w=200",
      },
    ],
    products: [
      {
        title: "KitchenAid Artisan Mixer",
        description:
          "The iconic stand mixer offers power and durability to handle all your favorite culinary tasks.",
      },
      {
        title: "Nespresso Vertuo Pop",
        description:
          "Compact and stylish coffee machine that brews a wide range of coffee styles at the touch of a button.",
      },
      {
        title: "IKEA Poang Chair",
        description:
          "A classic design with a bentwood frame that provides flexible comfort and a timeless look.",
      },
      {
        title: "Philips Air Fryer XL",
        description:
          "Cook your favorite foods with up to 90% less fat using rapid air technology for perfect results.",
      },
      {
        title: "IKEA Kallax Shelf Unit",
        description:
          "A versatile storage solution that can be used against a wall or as a room divider.",
      },
      {
        title: "KitchenAid Cold Brew Maker",
        description:
          "Easy to use, pour and clean. Treats you to smooth, rich full-bodied cold brew coffee anytime.",
      },
      {
        title: "Philips Hue Smart Bulb",
        description:
          "High-quality smart lighting that you can control from your phone to set the perfect mood.",
      },
      {
        title: "Nespresso Coffee Pods",
        description:
          "A variety pack of premium coffee capsules designed for the ultimate Nespresso experience.",
      },
      {
        title: "IKEA Malm Bed Frame",
        description:
          "A clean design that looks good from every angle, featuring integrated storage for extra space.",
      },
      {
        title: "KitchenAid Blender",
        description:
          "Designed to deliver the perfect taste, with a powerful motor and unique asymmetric blade.",
      },
    ],
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
    brands: [
      {
        name: "L-Oreal",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=200",
      },
      {
        name: "Sephora",
        image:
          "https://images.unsplash.com/photo-1527275393322-8ddae8bd5de9?q=80&w=200",
      },
      {
        name: "Estee Lauder",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200",
      },
      {
        name: "MAC",
        image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=200",
      },
    ],
    products: [
      {
        title: "MAC Matte Lipstick",
        description:
          "The iconic product that made MAC famous. Long-wearing, high-pigment formula with a matte finish.",
      },
      {
        title: "Sephora Face Mask",
        description:
          "A range of fiber masks infused with different ingredients to target various skin concerns.",
      },
      {
        title: "Estee Lauder Advanced Night Repair",
        description:
          "The #1 serum in the US. Delivers significant reduction in the look of key signs of aging.",
      },
      {
        title: "L-Oreal Revitalift Serum",
        description:
          "Highly concentrated Hyaluronic Acid serum that visibly plumps skin and reduces wrinkles.",
      },
      {
        title: "MAC Fix+ Setting Spray",
        description:
          "A lightweight water mist that gently soothes and refreshes skin and finishes makeup.",
      },
      {
        title: "Sephora Liquid Eyeliner",
        description:
          "Precision liquid eyeliner with a long-wearing formula and a flexible brush tip for easy application.",
      },
      {
        title: "Estee Lauder Double Wear Stay-in-Place",
        description:
          "24-hour long-wear liquid foundation that stays fresh and looks natural through all circumstances.",
      },
      {
        title: "L-Oreal Paris Voluminous Mascara",
        description:
          "Uniquely formulated to resist clumping, keep lashes soft, and build lashes to 5X their natural thickness.",
      },
      {
        title: "MAC Studio Fix Powder",
        description:
          "A one-step powder and foundation that gives skin a smooth, flawless, all-matte finish with medium-to-full coverage.",
      },
      {
        title: "Sephora Collection Cleansing Oil",
        description:
          "A gentle cleansing oil that removes all types of makeup, even waterproof, without leaving a greasy film.",
      },
    ],
  },
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

const seedData = async () => {
  try {
    await deleteData();

    console.log("Seeding categories and brands...");
    const categoriesMap = {};
    const brandsMap = {};

    for (const catData of data) {
      const category = await Category.create({
        name: catData.name,
        slug: slugify(catData.name),
        image: catData.image,
      });
      categoriesMap[catData.name] = category;

      for (const brandData of catData.brands) {
        if (!brandsMap[brandData.name]) {
          const brand = await Brand.create({
            name: brandData.name,
            slug: slugify(brandData.name),
            image: brandData.image,
          });
          brandsMap[brandData.name] = brand;
        }
      }
    }

    console.log("Generating 1000 products...");
    const products = [];
    const colors = ["Red", "Blue", "Green", "Black", "White", "Silver", "Gold"];

    for (let i = 0; i < 1000; i++) {
      const catData = data[Math.floor(Math.random() * data.length)];
      const productTemplate =
        catData.products[Math.floor(Math.random() * catData.products.length)];
      const brandData =
        catData.brands[Math.floor(Math.random() * catData.brands.length)];

      const category = categoriesMap[catData.name];
      const brand = brandsMap[brandData.name];

      const price = Math.floor(Math.random() * 2000) + 50;
      const discount =
        Math.random() > 0.7 ? Math.floor(price * 0.8) : undefined;

      const productTitle = `${productTemplate.title} ${i + 1}`;

      products.push({
        title: productTitle,
        slug: slugify(productTitle, { lower: true }),
        description: `${productTemplate.description} This high-quality product from ${brand.name} is a must-have in the ${category.name} section. Guaranteed quality and performance for everyday use.`,
        quantity: Math.floor(Math.random() * 500) + 20,
        sold: Math.floor(Math.random() * 100),
        price: price,
        priceAfterDiscount: discount,
        colors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
        imageCover: catData.image, // Using category image as placeholder for cover
        images: [catData.image, brand.image],
        category: category._id,
        brand: brand._id,
        ratingsAverage: (Math.random() * 1.5 + 3.5).toFixed(1),
        ratingsQuantity: Math.floor(Math.random() * 200) + 1,
      });
    }

    await Product.insertMany(products);
    console.log(`Successfully seeded 1000 products!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

dbConnection().then(() => seedData());
