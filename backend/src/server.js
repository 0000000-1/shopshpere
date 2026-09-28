import "dotenv/config";
import express from "express";
import cors from "cors";
import MongoDb from "./config/db.js";
import dns from "node:dns/promises";

import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
//core configuration
dns.setServers(["1.1.1.1", "8.8.8.8"]);
MongoDb();

const app = express();
//Global middleware
app.use(cors());
app.use(express.json());
//Application routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes); // stripe
app.use("/api/users", userRoutes);
// 1. i got user error somewhere i dont know yet

app.get("/", (req, res) => {
  res.send("server working locally successfully!");
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Route Not Found - ${req.method} ${req.originalUrl}`);
  next(error); // This sends it down to the errorHandler
});
// Fallback Error Handler (Must remain dead last)
app.use(errorHandler);

const PORT = process.env.PORT || 2001;

app.listen(PORT, () => {
  console.log("server running");
});
