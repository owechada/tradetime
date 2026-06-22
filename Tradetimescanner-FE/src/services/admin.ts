import axios from "axios";
import { baseURL } from "../utils/URL";

// Dashboard & Analytics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${baseURL}admin/dashboard/stats`);
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

export const getSystemInfo = async () => {
  try {
    const response = await axios.get(`${baseURL}admin/system/info`);
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

// User Management
export const getAllUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = params;
    const response = await axios.get(
      `${baseURL}admin/users?page=${page}&limit=${limit}&search=${search}&status=${status}`
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

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${baseURL}admin/users/${userId}`);
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

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await axios.put(
      `${baseURL}admin/users/${userId}`,
      userData
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

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${baseURL}admin/users/${userId}`);
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

export const toggleUserStatus = async (userId: string) => {
  try {
    const response = await axios.patch(
      `${baseURL}admin/users/${userId}/toggle-status`
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

export const getUserActivity = async (userId: string) => {
  try {
    const response = await axios.get(
      `${baseURL}admin/users/${userId}/activity`
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

// Premium Management
export const grantPremiumAccess = async (
  userId: string,
  data?: {
    expiryDate?: string;
    subscriptionId?: string;
  }
) => {
  try {
    const response = await axios.post(
      `${baseURL}admin/users/${userId}/premium/grant`,
      { ...data, subscriptionId: data?.subscriptionId//"admin-granted"
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

export const revokePremiumAccess = async (userId: string) => {
  try {
    const response = await axios.delete(
      `${baseURL}admin/users/${userId}/premium/revoke`
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

// Trial Management
export const grantTrialAccess = async (
  userId: string,
  data?: { trialDays?: number }
) => {
  try {
    const response = await axios.post(
      `${baseURL}admin/users/${userId}/trial/grant`,
      data || {}
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

export const revokeTrialAccess = async (userId: string) => {
  try {
    const response = await axios.delete(
      `${baseURL}admin/users/${userId}/trial/revoke`
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

// Free Trial Status Management
export const checkFreeTrialStatus = async (userId: string) => {
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

export const toggleFreeTrialStatus = async (userId: string) => {
  try {
    const response = await axios.patch(
      `${baseURL}admin/users/${userId}/free-trial/toggle`
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

// Admin Management
export const promoteToAdmin = async (userId: string) => {
  try {
    const response = await axios.post(
      `${baseURL}admin/users/${userId}/admin/promote`
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

export const revokeAdminPrivileges = async (userId: string) => {
  try {
    const response = await axios.delete(
      `${baseURL}admin/users/${userId}/admin/revoke`
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

// Bulk Operations
export const bulkUpdateUsers = async (userIds: string[], updateData: any) => {
  try {
    const response = await axios.put(`${baseURL}admin/users/bulk/update`, {
      userIds,
      updateData,
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

export const bulkDeleteUsers = async (userIds: string[]) => {
  try {
    const response = await axios.delete(`${baseURL}admin/users/bulk/delete`, {
      data: { userIds },
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

// Email Marketing
export const sendPromotionalEmail = async (emailData: {
  subject: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  segment: "all" | "active_subscribers" | "trial_users" | "expired_subscribers";
}) => {
  try {
    const response = await axios.post(`${baseURL}api/emails/promotional`, emailData);
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

export const sendBulkEmail = async (emailData: {
  subject: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  emails: string[];
}) => {
  try {
    const response = await axios.post(`${baseURL}api/emails/bulk`, emailData);
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

export const previewEmail = async (emailData: {
  subject: string;
  content: string;
  ctaText: string;
  ctaLink: string;
}) => {
  try {
    const response = await axios.post(`${baseURL}api/emails/preview`, emailData);
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
