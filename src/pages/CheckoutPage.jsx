import Header from "../components/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { getCart, updateCart } from "../utils/cart";
import { toast } from "sonner";
import validator from "email-validator";
import { createOrder } from "../utils/api_orders";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from "react-cookie";

const CheckoutPage = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; // assign empty object to avoid error if user not logged in
  const { token = "", email = "", name = "" } = currentuser;
  // load the cart items from the local storage
  const [cart, setCart] = useState(getCart());
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((product) => {
      total += product.quantity * product.price;
    });
    return total;
  };

  const handleCheckout = async () => {
    // 1. make sure the name and email fields is not empty
    if (!name || !email) {
      toast.error("Please fill up all the fields");
    } else if (!validator.validate(email)) {
      // 2. make sure the email is valid
      toast.error("Please use a valid email address");
    } else {
      // 3. do checkout
      try {
        // open loading backdrop
        setLoading(true);
        // 3.1 get total price
        const totalPrice = getCartTotal();
        // 3.2 create order
        const response = await createOrder(name, email, cart, totalPrice);
        // 3.3 get the billplz url from the response
        const billplz_url = response.billplz_url;
        // 3.4 redirect the user to billplz payment page
        window.location.href = billplz_url;
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // close the loading backdrop
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header current="checkout" title="Checkout" />
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Typography variant="h5" mb={4}>
              Contact Information
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <Button fullWidth variant="contained" onClick={handleCheckout}>
                Pay ${getCartTotal()}
              </Button>
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Typography variant="h5">Your Order Summary</Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.length > 0 ? (
                    cart.map((product) => (
                      <TableRow
                        key={product._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {product.name}
                        </TableCell>
                        <TableCell align="right">
                          ${(product.price * product.quantity).toFixed(2)}
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
                    <TableCell colSpan={1}></TableCell>
                    <TableCell align="right">${getCartTotal()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CheckoutPage;
