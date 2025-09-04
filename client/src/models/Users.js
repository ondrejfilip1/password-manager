import axios from "axios";
import { getURL } from "@/utils/GetURL";

export const register = async (formData) => {
  try {
    const res = await axios.post(`${getURL()}/users/register`, formData);
    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.payload.username);
    localStorage.setItem("email", data.payload.email);

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(`${getURL()}/users/login`, formData);
    const data = res.data;

    /*
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.payload.username);
    localStorage.setItem("email", data.payload.email);
*/

    return {
      status: res.status,
      message: data.message,
      //user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const verifyOTP = async (formData) => {
  try {
    const res = await axios.post(`${getURL()}/users/verify-otp`, formData);
    const data = res.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.payload.username);
    localStorage.setItem("email", data.payload.email);
    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const addPassword = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(`${getURL()}/users/add-password`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const removePassword = async (formData, id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${getURL()}/users/remove-password/${id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const getPasswords = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(`${getURL()}/users/get-passwords`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};
