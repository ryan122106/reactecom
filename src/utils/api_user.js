import axios from "axios";
import { API_URL } from "./constants";

export const loginUser = async (email, password) => {
  const response = await axios.post(API_URL + 'users/login', {
    email,
    password,
  });
  return response.data;
};


export const SignUpUser = async (name, email, password, confirmPassword) => {
  const response = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};
