-- Migration script to update GeneratedStrategies table column types
-- Run this SQL script in your MySQL database to fix the column size issues

-- Update column types to TEXT to handle longer content
ALTER TABLE GeneratedStrategies 
MODIFY COLUMN strategyName TEXT,
MODIFY COLUMN recommendedtradetime TEXT,
MODIFY COLUMN recommendedtimeframe TEXT,
MODIFY COLUMN originalIndicators TEXT,
MODIFY COLUMN originalTradetime TEXT,
MODIFY COLUMN originalTimeframe TEXT;

-- Verify the changes
DESCRIBE GeneratedStrategies;
