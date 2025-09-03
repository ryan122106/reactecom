import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getCart, updateCart } from "../utils/cart";

const CartPage = () => {
  // load the cart items from the local storage
  const [cart, setCart] = useState(getCart());

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((product) => {
      total += product.quantity * product.price;
    });
    return total;
  };

  const removeItemFromCart = (product) => {
    // 1. remove product from cart
    const updatedCart = cart.filter((item) => item._id !== product._id);
    // 2. update the cart data in local storage and the state
    updateCart(updatedCart);
    // 3. update the state
    setCart(updatedCart);
  };

  return (
    <>
      <Header current="cart" title="Cart" />
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.length > 0 ? (
                cart.map((product) => (
                  <TableRow
                    key={product._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">
                      ${(product.price * product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          removeItemFromCart(product);
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    No product has been added to cart yet
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell align="right">${getCartTotal()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ pt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/checkout"
            // disable the checkout page if no item found in cart
            disabled={cart.length === 0 ? true : false}
          >
            Checkout
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CartPage;
