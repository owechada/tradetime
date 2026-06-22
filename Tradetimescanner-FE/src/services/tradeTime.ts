import axios from "axios";
import { baseURL } from "../utils/URL";

/**
 * Get the current market status including active sessions, liquidity, and trading recommendation
 */
const getMarketStatus = async () => {
  try {
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const response = await axios.post(`${baseURL}api/tradetime/status`, {
      timezone,
    });
    return response.data;
  } catch (error: any) {
    console.log(error?.response);
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};

/**
 * Get currency pair recommendations based on the current trading session
 */
const getPairRecommendations = async () => {
  try {
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const response = await axios.post(`${baseURL}api/tradetime/recommendations`, {
      timezone,
    });
    return response.data;
  } catch (error: any) {
    console.log(error?.response);
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};

export { getMarketStatus, getPairRecommendations };
