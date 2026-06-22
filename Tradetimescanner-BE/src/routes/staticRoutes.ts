import { Router } from "express";
import express from "express";
import path from "path";

const staticRouter = Router();

// Serve generated chart images
const chartsPath = path.join(process.cwd(), 'public', 'generated-charts');
staticRouter.use('/generated-charts', express.static(chartsPath));

// Health check for static files
staticRouter.get('/generated-charts/health', (req, res) => {
    res.json({
        success: true,
        message: 'Static file server is running',
        chartsPath: chartsPath,
        timestamp: new Date().toISOString()
    });
});

export default staticRouter;
