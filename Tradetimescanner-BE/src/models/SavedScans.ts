import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const SavedScans = sequelize.define(
  "SavedScans",

  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    market: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    starttime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    endtime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

export { SavedScans };
