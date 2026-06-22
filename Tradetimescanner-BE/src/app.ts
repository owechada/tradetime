import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";
import generateRoutes from "./routes/generateRoutes";
import saveRoutes from "./routes/saveRoutes";
import UserUpdatesRoutes from "./routes/UserUpdatesRoutes";
import Premium from "./routes/Premium";
import StrategySaveRouter from "./routes/StrategySaveRouter";
import generatedStrategyRoutes from "./routes/generatedStrategyRoutes";
import adminRoutes from "./routes/adminRoutes";
import testRoutes from "./routes/testRoutes";
import staticRoutes from "./routes/staticRoutes";
import emailRoutes from "./routes/emailRoutes";
import tradeTimeRoutes from "./routes/tradeTimeRoutes";
import proChartRoutes from "./routes/proChartRoutes";
import { setupLogging } from "./utils/logUtils";
import { initializeEmailScheduler } from "./services/emailScheduler";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

setupLogging();

// Test logs
console.log("This is a regular log");
console.error("This is an error log");
console.warn("This is a warning log");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/gen", generateRoutes);
app.use("/save", saveRoutes);
app.use("/user", UserUpdatesRoutes);
app.use("/api/strategies", StrategySaveRouter);
app.use("/api/generated-strategies", generatedStrategyRoutes);
app.use("/premium", Premium);
app.use("/admin", adminRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/tradetime", tradeTimeRoutes);
app.use("/api/pro-chart", proChartRoutes);
app.use("/test", testRoutes);

app.use("/pro-charts", express.static("public/pro-charts"));
app.use(staticRoutes); // Serve static files

app.get("/", (req, res) => {
  res.send("Time scanner server !");
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log("Database connected");
  
  // Initialize email scheduler for automated emails
  initializeEmailScheduler();
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;
