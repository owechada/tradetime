import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ProChartAnalysis extends Model {
  public id!: string;
  public userId!: string;
  public imagePath!: string;
  public market!: string;
  public marketType!: string;
  public timeframe!: string;
  public tradeMode!: string;
  public tradeDuration?: string;
  public analysisResult!: any;
}

ProChartAnalysis.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    market: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marketType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeframe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tradeMode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tradeDuration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    analysisResult: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "pro_chart_analyses",
    timestamps: true,
  }
);

export default ProChartAnalysis;
