import axios from "axios";
import { baseURL } from "../utils/URL";

const onGetAllsaveSignal = async () => {
    try {
        const response = await axios.get(`${baseURL}api/strategies`);
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

const onDeleteSignal = async (id:string) => {
    try {
        const response = await axios.delete(`${baseURL}api/strategies/${id}`);
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


const onGetUserAllsaveSignal = async (userid: string) => {
    try {
        const response = await axios.get(`${baseURL}api/strategies/?userid=${userid}`);
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
const onSaveTradeSignal = async (postData: any) => {
    try {
        const response = await axios.post(
            `${baseURL}api/strategies`,
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

export { onGetAllsaveSignal, onDeleteSignal, onGetUserAllsaveSignal,onSaveTradeSignal }