import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const SaveStrategy = sequelize.define("SaveStrategy", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pair: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  kindoff: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  stop_loss: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  TP1: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  TP2: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  TP3: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  trade_type: {
    type: DataTypes.ENUM("BUY", "SELL"),
    allowNull: false,
  },
  win_confidence: {
    type: DataTypes.STRING, // or FLOAT if you want to store numeric values like 72.0
    allowNull: false,
  },
});

export { SaveStrategy };
