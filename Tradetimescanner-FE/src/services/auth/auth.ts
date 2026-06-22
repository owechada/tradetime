import axios from "axios";
import { baseURL } from "../../utils/URL";

const onLogin = async (postData:any) => {
    try {
      const response = await axios.post(`${baseURL}auth/login`, postData);
      return response.data;
    } catch (error:any) {
      if (error?.response?.data?.message === undefined) {
        throw error.message;
      } else {
        throw error?.response?.data?.message;
      }
    }
  };
const onResetpassword = async (postData:any) => {
    try {
      const response = await axios.post(`${baseURL}auth/resetpass`, postData);
      return response.data;
    } catch (error:any) {
      if (error?.response?.data?.message === undefined) {
        throw error.message;
      } else {
        throw error?.response?.data?.message;
      }
    }
  };

const onGoogleLogin = async (googleToken: string) => {
  try {
    const response = await axios.post(`${baseURL}auth/google-login`, {
      token: googleToken
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message === undefined) {
      throw error.message;
    } else {
      throw error?.response?.data?.message;
    }
  }
};

export { onLogin, onResetpassword, onGoogleLogin };