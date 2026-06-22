import axios from "axios";
import { baseURL } from "../utils/URL";
import { ProChartAnalysisResponse } from "../types/proChart";

/**
 * Analyze clinical chart image or PDF
 * @param formData FormData containing chart file, marketType, timeframe, and userId
 */
export const analyzeChart = async (formData: FormData): Promise<{ success: boolean; data: { analysisResult: ProChartAnalysisResponse } }> => {
  try {
    const response = await axios.post(`${baseURL}api/pro-chart/analyze`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error analyzing chart:", error?.response || error);
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};

/**
 * Get analysis history for a specific user
 * @param userId The unique ID of the user
 */
export const getAnalysisHistory = async (userId: string): Promise<Array<{ id: string; market: string; marketType: string; timeframe: string; tradeMode: string; analysisResult: ProChartAnalysisResponse; createdAt: string }>> => {
  try {
    const response = await axios.get(`${baseURL}api/pro-chart/history/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching analysis history:", error?.response || error);
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};
