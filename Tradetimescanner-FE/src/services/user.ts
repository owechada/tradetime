import axios from "axios";
import { baseURL } from "../utils/URL";

const onSaveScan = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}save/add`, postData);
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
const onGetSaveScan = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}save/getuserscans`, postData);
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
const onDeleteSaveScan = async (id: any) => {
  try {
    const response = await axios.post(`${baseURL}save/delete/${id}`);
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
const onVerifyUser = async (id: any) => {
  try {
    const response = await axios.post(`${baseURL}user/verify/${id}`);
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
const onCreateCheckout = async (postdata: any) => {
  try {
    const response = await axios.post(`${baseURL}premium/checkout`, postdata);
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
const onCreateSubscription = async (postdata: any) => {
  try {
    const response = await axios.post(`${baseURL}premium/subscribe`, postdata);
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

const initiatePaymentIntent = async (postdata: any) => {
  //to get clientSecret

  try {
    const response = await axios.post(`${baseURL}premium/payintent/`, postdata);
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

// Free Trial Management
const requestFreeTrial = async (userId: string) => {
  try {
    const response = await axios.post(
      `${baseURL}admin/users/${userId}/trial/grant`,
      {
        trialDays: 3,
      }
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

const checkFreeTrialStatus = async (userId: string) => {
  try {
    const response = await axios.get(
      `${baseURL}admin/users/${userId}/free-trial/status`
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

const getuserById = async (id: any) => {
  try {
    const response = await axios.get(`${baseURL}user/getuser/${id}`);
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
const getallusers = async (from: string, to: string, page: number) => {
  try {
    const response = await axios.get(
      `${baseURL}user/getall?page=${page}&limit=20&from=${from}&to=${to}`
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
const Cancelsubscription = async (id: any) => {
  try {
    const response = await axios.post(`${baseURL}premium/cancel/${id}`);
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
const getSubscription = async (id: any) => {
  try {
    const response = await axios.get(`${baseURL}premium/retrive/${id}`);
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
const getSession = async (id: any) => {
  try {
    const response = await axios.get(`${baseURL}premium/session/${id}`);
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
const onCreateUser = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}auth/signup`, postData);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};
const onUpdateUser = async (postData: any, id: string) => {
  try {
    const response = await axios.patch(`${baseURL}user/update/${id}`, postData);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};

const onSaveStrategy = async (postData: any) => {
  try {
    const response = await axios.post(`${baseURL}api/generated-strategies/save`, postData);
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

const onGetSavedStrategies = async (userId: string) => {
  try {
    const response = await axios.get(`${baseURL}api/generated-strategies/user/${userId}`);
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

const onGetStrategyById = async (strategyId: string) => {
  try {
    const response = await axios.get(`${baseURL}api/generated-strategies/${strategyId}`);
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

const onCreateCryptoCheckout = async (postdata: any) => {
  try {
    const response = await axios.post(`${baseURL}premium/ccpayment/checkout`, postdata);
    return response.data;
  } catch (error: any) {
    console.log(error?.response);
    if (error?.response?.data) {
      const { message, details } = error.response.data;
      if (message) {
        throw details ? `${message} - ${details}` : message;
      }
    }
    throw error.message || "An unknown error occurred";
  }
};

export {
  onSaveScan,
  onCreateCheckout,
  onDeleteSaveScan,
  getuserById,
  onVerifyUser,
  onUpdateUser,
  initiatePaymentIntent,
  onCreateUser,
  Cancelsubscription,
  getallusers,
  onCreateSubscription,
  getSubscription,
  onGetSaveScan,
  getSession,
  requestFreeTrial,
  checkFreeTrialStatus,
  onSaveStrategy,
  onGetSavedStrategies,
  onGetStrategyById,
  onCreateCryptoCheckout,
};
