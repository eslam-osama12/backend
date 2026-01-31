class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Build a proper MongoDB query object from the query string
    // Express sends keys like "ratingsAverage[gte]" as literal strings, not nested objects
    const mongoQuery = {};

    Object.keys(queryStringObj).forEach((key) => {
      const value = queryStringObj[key];

      // Check if key has bracket notation like "field[operator]"
      const bracketMatch = key.match(/^(\w+)\[(\w+)\]$/);

      if (bracketMatch) {
        const [, fieldName, operator] = bracketMatch;

        // Handle [in] operator - split comma-separated values into array
        if (operator === "in") {
          const values = value.split(",").map((v) => v.trim());
          mongoQuery[fieldName] = { [`$${operator}`]: values };
        }
        // Handle comparison operators [gte, gt, lte, lt]
        else if (["gte", "gt", "lte", "lt"].includes(operator)) {
          // Convert value to number if it's numeric
          const numValue =
            !isNaN(value) && value.trim() !== "" ? Number(value) : value;

          // If field already has operators, add to it
          if (
            mongoQuery[fieldName] &&
            typeof mongoQuery[fieldName] === "object"
          ) {
            mongoQuery[fieldName][`$${operator}`] = numValue;
          } else {
            mongoQuery[fieldName] = { [`$${operator}`]: numValue };
          }
        }
      } else {
        // Regular field (no bracket notation)
        // Don't convert ObjectIds (24 char hex strings) to numbers
        if (!isNaN(value) && value.trim() !== "" && value.length !== 24) {
          mongoQuery[key] = Number(value);
        } else {
          mongoQuery[key] = value;
        }
      }
    });

    this.mongooseQuery = this.mongooseQuery.find(mongoQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
