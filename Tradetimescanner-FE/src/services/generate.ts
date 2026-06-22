import axios from "axios";
import { baseURL } from "../utils/URL";

const onGenerateCurrencypairs = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/getcurrencypair`,
      postData
    );
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
const onGetStablePairs = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}gen/getstable`, postData);
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
const onGetTradeSignal = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}gen/gettradesignal`, postData);
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

const onGenerateStrategy = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}gen/genstrategy`, postData);
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

const onRecommendOptionsStrategy = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/genstrategy/options`,
      postData
    );
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

const onRecommendForexStrategy = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/genstrategy/forex`,
      postData
    );
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

const onRecommendCryptoStrategy = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/genstrategy/crypto`,
      postData
    );
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

const onRecommendGoldStrategy = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/genstrategy/gold`,
      postData
    );
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

const onRecommendIndicesStrategy = async (postData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}gen/genstrategy/indices`,
      postData
    );
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

export {
  onGenerateCurrencypairs,
  onGetTradeSignal,
  onGetStablePairs,
  onRecommendOptionsStrategy,
  onRecommendForexStrategy,
  onRecommendCryptoStrategy,
  onRecommendGoldStrategy,
  onRecommendIndicesStrategy,
  onGenerateStrategy,
};
