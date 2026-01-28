import serverless from "serverless-http";
import "dotenv/config";

const express = require("express");
const cors = require("cors");

// Import route handlers
import { handleDemo } from "../../server/routes/demo";
import { handleGetVendors } from "../../server/routes/vendors";
import { handleGetProducts } from "../../server/routes/products";
import { handleGetCategories, handleGetSubCategories, handleGetCategoryWithProducts } from "../../server/routes/categories";
import {
  handleGetProductRatings,
  handleGetUserRating,
  handleCreateOrUpdateRating,
  handleDeleteRating,
} from "../../server/routes/ratings";

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/ping", (_req: any, res: any) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

app.get("/api/demo", handleDemo);
app.get("/api/users", handleGetVendors);
app.get("/api/products", handleGetProducts);
app.get("/api/categories", handleGetCategories);
app.get("/api/sub-categories", handleGetSubCategories);
app.get("/api/categories-with-products/:categoryId", handleGetCategoryWithProducts);

// Ratings routes
app.get("/api/products/:productId/ratings", handleGetProductRatings);
app.get("/api/products/:productId/my-rating", handleGetUserRating);
app.post("/api/products/:productId/ratings", handleCreateOrUpdateRating);
app.delete("/api/ratings/:ratingId", handleDeleteRating);

export const handler = serverless(app);



