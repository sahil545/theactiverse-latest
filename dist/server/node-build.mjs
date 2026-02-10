import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
class RequestQueue {
  queue = [];
  processing = false;
  requestTimestamps = /* @__PURE__ */ new Map();
  maxRequestsPerSecond = 2;
  // Max 2 requests per second per endpoint
  minIntervalBetweenRequests = 500;
  // Minimum 500ms between requests to same endpoint
  async enqueue(key, fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, fn, resolve, reject });
      this.process();
    });
  }
  async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }
    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request) break;
      try {
        await this.waitIfNeeded(request.key);
        this.recordRequest(request.key);
        const result = await request.fn();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
      await this.delay(100);
    }
    this.processing = false;
  }
  waitIfNeeded(key) {
    return new Promise((resolve) => {
      const timestamps = this.requestTimestamps.get(key) || [];
      const now = Date.now();
      const recentTimestamps = timestamps.filter(
        (ts) => now - ts < 1e3
      );
      if (recentTimestamps.length >= this.maxRequestsPerSecond) {
        const oldestTimestamp = recentTimestamps[0];
        const waitTime = Math.max(0, oldestTimestamp + 1e3 - now + 100);
        setTimeout(resolve, waitTime);
      } else {
        if (recentTimestamps.length > 0) {
          const lastTimestamp = recentTimestamps[recentTimestamps.length - 1];
          const timeSinceLastRequest = now - lastTimestamp;
          if (timeSinceLastRequest < this.minIntervalBetweenRequests) {
            const waitTime = this.minIntervalBetweenRequests - timeSinceLastRequest;
            setTimeout(resolve, waitTime);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      }
    });
  }
  recordRequest(key) {
    const now = Date.now();
    const timestamps = this.requestTimestamps.get(key) || [];
    const recentTimestamps = timestamps.filter((ts) => now - ts < 1e3);
    recentTimestamps.push(now);
    this.requestTimestamps.set(key, recentTimestamps);
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
const requestQueue = new RequestQueue();
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 1e4, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}
const LARAVEL_API_URL$3 = "https://admin.theactiverse.com/api";
const vendorsCache = /* @__PURE__ */ new Map();
const CACHE_TTL$3 = 10 * 60 * 1e3;
function getCacheKey$3(...args) {
  return JSON.stringify(args);
}
function getCachedData$3(key) {
  const cached = vendorsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL$3) {
    return cached.data;
  }
  vendorsCache.delete(key);
  return null;
}
function setCachedData$3(key, data) {
  vendorsCache.set(key, { data, timestamp: Date.now() });
}
const handleGetVendors = async (req, res) => {
  try {
    const cacheKey = getCacheKey$3("vendors");
    const cachedData = getCachedData$3(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        "vendors",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL$3}/users`, { timeout: 1e4 });
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data.status && Array.isArray(data.data)) {
        const vendors = data.data.filter(
          (user) => user.role === "vendor" && user.status === 1
        );
        const responseData = { status: true, data: vendors };
        setCachedData$3(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      console.warn("Laravel API error, returning empty vendors:", error);
    }
    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetVendors:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const LARAVEL_API_URL$2 = "https://admin.theactiverse.com/api";
const productsCache = /* @__PURE__ */ new Map();
const CACHE_TTL$2 = 10 * 60 * 1e3;
function getCacheKey$2(...args) {
  return JSON.stringify(args);
}
function getCachedData$2(key) {
  const cached = productsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL$2) {
    return cached.data;
  }
  productsCache.delete(key);
  return null;
}
function setCachedData$2(key, data) {
  productsCache.set(key, { data, timestamp: Date.now() });
}
const handleGetProducts = async (req, res) => {
  try {
    const cacheKey = getCacheKey$2("products");
    const cachedData = getCachedData$2(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        "products",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL$2}/products`, { timeout: 1e4 });
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data.status && Array.isArray(data.data)) {
        const activeProducts = data.data.filter(
          (product) => product.product_status === "1"
        );
        const responseData = { status: true, data: activeProducts };
        setCachedData$2(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      console.warn("Laravel API error, returning empty products:", error);
    }
    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetProducts:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const LARAVEL_API_URL$1 = "https://admin.theactiverse.com/api";
const categoriesCache = /* @__PURE__ */ new Map();
const CACHE_TTL$1 = 10 * 60 * 1e3;
function getCacheKey$1(...args) {
  return JSON.stringify(args);
}
function getCachedData$1(key) {
  const cached = categoriesCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL$1) {
    return cached.data;
  }
  categoriesCache.delete(key);
  return null;
}
function setCachedData$1(key, data) {
  categoriesCache.set(key, { data, timestamp: Date.now() });
}
const handleGetCategories = async (req, res) => {
  try {
    const cacheKey = getCacheKey$1("categories");
    const cachedData = getCachedData$1(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        "categories",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL$1}/categories`, { timeout: 1e4 });
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data.status && Array.isArray(data.data)) {
        const responseData = { status: true, data: data.data };
        setCachedData$1(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      console.warn("Laravel API error, returning empty categories:", error);
    }
    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetCategories:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleGetSubCategories = async (req, res) => {
  try {
    const cacheKey = getCacheKey$1("sub-categories");
    const cachedData = getCachedData$1(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        "sub-categories",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL$1}/sub-categories`, { timeout: 1e4 });
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data.status && Array.isArray(data.data)) {
        const responseData = { status: true, data: data.data };
        setCachedData$1(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      console.warn("Laravel API error, returning empty sub-categories:", error);
    }
    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetSubCategories:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleGetCategoryWithProducts = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const cacheKey = getCacheKey$1("category-with-products", categoryId);
    const cachedData = getCachedData$1(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        `category-with-products-${categoryId}`,
        async () => {
          const response = await fetchWithTimeout(
            `${LARAVEL_API_URL$1}/categories-with-products/${categoryId}`,
            { timeout: 1e4 }
          );
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data.status && data.data) {
        const responseData = { status: true, data: data.data };
        setCachedData$1(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      console.warn(
        "Laravel API error, returning empty category with products:",
        error
      );
    }
    res.json({ status: false, data: null });
  } catch (error) {
    console.error("Error in handleGetCategoryWithProducts:", error);
    res.json({
      status: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const LARAVEL_API_URL = "https://admin.theactiverse.com/api";
const ratingsCache = /* @__PURE__ */ new Map();
const CACHE_TTL = 5 * 60 * 1e3;
function getCacheKey(...args) {
  return JSON.stringify(args);
}
function getCachedData(key) {
  const cached = ratingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  ratingsCache.delete(key);
  return null;
}
function setCachedData(key, data) {
  ratingsCache.set(key, { data, timestamp: Date.now() });
}
const handleGetProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = req.query.page || 1;
    const cacheKey = getCacheKey("ratings", productId, page);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const data = await requestQueue.enqueue(
        `ratings-${productId}`,
        async () => {
          const response = await fetchWithTimeout(
            `${LARAVEL_API_URL}/products/${productId}/ratings?page=${page}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              timeout: 1e4
            }
          );
          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }
          return response.json();
        }
      );
      if (data && (data.status || data.success)) {
        setCachedData(cacheKey, data);
        return res.json(data);
      }
    } catch (error) {
      console.warn(
        "Laravel API error, returning empty ratings for product:",
        productId,
        error
      );
    }
    res.json({ status: false, ratings: [] });
  } catch (error) {
    console.error("Error in handleGetProductRatings:", error);
    res.json({
      status: false,
      ratings: [],
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleGetUserRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required"
      });
    }
    const response = await fetchWithTimeout(
      `${LARAVEL_API_URL}/products/${productId}/my-rating`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        timeout: 1e4
      }
    );
    if (!response.ok) {
      throw new Error(`Laravel API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user rating from Laravel API:", error);
    res.status(500).json({
      status: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleCreateOrUpdateRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, guest_email, guest_name } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    const body = {
      rating,
      comment: comment || null
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (guest_email && guest_name) {
      body.guest_email = guest_email;
      body.guest_name = guest_name;
    } else {
      return res.status(400).json({
        status: false,
        message: "Either authentication token or guest email/name is required"
      });
    }
    const response = await fetchWithTimeout(
      `${LARAVEL_API_URL}/products/${productId}/ratings`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        timeout: 1e4
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `API error: ${response.status}`
      );
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    res.status(500).json({
      status: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleDeleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required"
      });
    }
    const response = await fetchWithTimeout(`${LARAVEL_API_URL}/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      timeout: 1e4
    });
    if (!response.ok) {
      throw new Error(`Laravel API responded with status ${response.status}`);
    }
    res.json({ status: true, message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({
      status: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/users", handleGetVendors);
  app2.get("/api/products", handleGetProducts);
  app2.get("/api/categories", handleGetCategories);
  app2.get("/api/sub-categories", handleGetSubCategories);
  app2.get("/api/categories-with-products/:categoryId", handleGetCategoryWithProducts);
  app2.get("/api/products/:productId/ratings", handleGetProductRatings);
  app2.get("/api/products/:productId/my-rating", handleGetUserRating);
  app2.post("/api/products/:productId/ratings", handleCreateOrUpdateRating);
  app2.delete("/api/ratings/:ratingId", handleDeleteRating);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname$1 = import.meta.dirname;
const distPath = path.join(__dirname$1, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
