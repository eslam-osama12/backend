const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [3, "Review title must be at least 3 characters"],
      maxlength: [200, "Review title must not exceed 200 characters"],
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must not exceed 5.0"],
      required: [true, "Review rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    // Parent Reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true },
);

// Ensure one review per user per product (prevent duplicates)
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId,
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  },
);

module.exports = mongoose.model("Review", reviewSchema);
