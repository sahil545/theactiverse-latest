import serverless from "serverless-http";

// Create Express app with all routes
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API routes
app.get("/api/ping", (_req: any, res: any) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

// Simple demo route
app.get("/api/demo", (_req: any, res: any) => {
  res.status(200).json({
    message: "Hello from Express server",
  });
});

// Basic routes - these will work without database
app.get("/api/vendors", (_req: any, res: any) => {
  res.json({ data: [], message: "Vendors endpoint" });
});

app.get("/api/products", (_req: any, res: any) => {
  res.json({ data: [], message: "Products endpoint" });
});

app.get("/api/categories", (_req: any, res: any) => {
  res.json({ data: [], message: "Categories endpoint" });
});

export const handler = serverless(app);



