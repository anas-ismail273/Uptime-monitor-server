import express, { json } from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import { cronService } from "./services/cron-service.js";

// Import routes
import routes from "./routes.js";

// Load config
config();
const app = express();

// Connect to DB
connectDB();

// Start background jobs
cronService.start();

// Route Middlewares
app.use(json());
app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Follow the steps in the README file to use the API");
});
