import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetVendors } from "./routes/vendors";
import { handleGetProducts } from "./routes/products";
import { handleGetCategories, handleGetSubCategories, handleGetCategoryWithProducts } from "./routes/categories";
import {
  handleGetProductRatings,
  handleGetUserRating,
  handleCreateOrUpdateRating,
  handleDeleteRating,
} from "./routes/ratings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/vendors", handleGetVendors);
  app.get("/api/products", handleGetProducts);
  app.get("/api/categories", handleGetCategories);
  app.get("/api/sub-categories", handleGetSubCategories);
  app.get("/api/categories-with-products/:categoryId", handleGetCategoryWithProducts);

  // Ratings routes
  app.get("/api/products/:productId/ratings", handleGetProductRatings);
  app.get("/api/products/:productId/my-rating", handleGetUserRating);
  app.post("/api/products/:productId/ratings", handleCreateOrUpdateRating);
  app.delete("/api/ratings/:ratingId", handleDeleteRating);

  return app;
}
