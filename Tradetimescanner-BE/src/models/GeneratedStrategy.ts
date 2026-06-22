import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const GeneratedStrategy = sequelize.define("GeneratedStrategy", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  strategyName: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recommendedIndicators: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  recommendedtradetime: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recommendedtimeframe: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  strategyexplanation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  signal_annotation: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  originalIndicators: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  originalTradetime: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  originalTimeframe: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export { GeneratedStrategy };
