import React, { useEffect, useState } from "react";
import { getCart, deleteItemFromCart, updateCart } from "../utils/cart";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "../components/Header";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleDelete = (id) => {
    const updated = deleteItemFromCart(id);
    setCart(updated);
  };

  const handleQuantity = (id, change) => {
    const item = cart.find((p) => p._id === id);
    if (!item) return;

    const newQty = item.quantity ? item.quantity + change : 1 + change;

    if (newQty <= 0) {
      handleDelete(id);
    } else {
      const updated = updateCart(id, { quantity: newQty });
      setCart(updated);
    }
  };

  const getTotal = () => {
  let total = 0;
  for (const item of cart) {
    total += item.price * (item.quantity || 1);
  }
  return total;
};

  return (
    <>
      <Header title="Cart" />
      <div style={{ padding: "20px" }}>

        {cart.length === 0 ? (
          <Typography>No products Add Yet!</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleQuantity(item._id, -1)}
                      ></Button>
                      {item.quantity || 1}
                      <Button
                        onClick={() => handleQuantity(item._id, 1)}
                      ></Button>
                    </TableCell>
                    <TableCell>${item.price * (item.quantity || 1)}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(item._id)}
                      >Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography
            sx={{ml:130}}
              variant="h6"
              style={{ marginTop: "20px" }}
            >
                ${getTotal().toFixed(2)}
            </Typography>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
