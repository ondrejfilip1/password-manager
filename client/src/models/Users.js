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
  axios
    .post(`${getURL()}/users/login`, formData)
    .then((res) => {
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.payload.username);
      localStorage.setItem("email", res.payload.email);
      return {
        status: res.status,
        message: res.message,
        user: res.payload,
      };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};

export const addPassword = async (formData) => {
  const token = localStorage.getItem("token");
  axios
    .post(`${getURL()}/users/add-password`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {})
    .catch((err) => {});
};

export const removePassword = async (formData) => {
  axios
    .delete(`${getURL()}/users/remove-password`, formData)
    .then((res) => {})
    .catch((err) => {});
};
