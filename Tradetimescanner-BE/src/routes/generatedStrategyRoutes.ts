import express from "express";
import {
  saveGeneratedStrategy,
  getGeneratedStrategiesByUser,
  getGeneratedStrategyById,
  updateGeneratedStrategy,
  deleteGeneratedStrategy,
  getAllGeneratedStrategies,
} from "../controllers/GeneratedStrategyController";

const router = express.Router();

// Save a generated strategy
router.post("/save", saveGeneratedStrategy);

// Get all strategies for a specific user
router.get("/user/:userid", getGeneratedStrategiesByUser);

// Get all strategies (admin endpoint)
router.get("/all", getAllGeneratedStrategies);

// Get a specific strategy by ID
router.get("/:id", getGeneratedStrategyById);

// Update a strategy
router.put("/:id", updateGeneratedStrategy);

// Delete a strategy
router.delete("/:id", deleteGeneratedStrategy);

export default router;
