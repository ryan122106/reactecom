import axios from "axios";

import { API_URL } from "./constants";

export const getOrders = async () => {
  const response = await axios.get(API_URL + "orders");
  return response.data;
};

export const createOrder = async (
  customerName,
  customerEmail,
  products,
  totalPrice
) => {
  const response = await axios.post(API_URL + "orders", {
    customerName: customerName,
    customerEmail: customerEmail,
    products: products,
    totalPrice, // short hand
  });

  return response.data;
};

export const updateOrder = async (id, body) => {
  const response = await axios.put(API_URL + "orders/" + id, body);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(API_URL + "orders/" + id);
  return response.data;
};
