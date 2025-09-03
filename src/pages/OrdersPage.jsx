import { useState, useEffect } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getOrders, updateOrder, deleteOrder } from "../utils/api_orders";
import { toast } from "sonner";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";

const OrdersPage = () => {
  // store orders data from API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // call the API
  useEffect(() => {
    getOrders()
      .then((data) => {
        // putting the data into orders state
        setOrders(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // call only once when the page load

  const handleStatusUpdate = async (id, newStatus) => {
    setLoading(true);
    await updateOrder(id, newStatus);
    const updatedOrders = await getOrders();
    setOrders(updatedOrders);
    toast.info("Status has been updated");
    setLoading(false);
  };

  const handleOrderDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // once user confirm, then we delete the product
      if (result.isConfirmed) {
        await deleteOrder(id);
        // method #1: get new orders data
        const updatedOrders = await getOrders();
        setOrders(updatedOrders);
        // method #2:
        // setOrders(orders.filter((i) => i._id !== id));
        toast.info("Order has been deleted");
      }
    });
  };

  return (
    <>
      <Header current="orders" title="My Orders" />
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {order.customerName}
                      <div>({order.customerEmail})</div>
                    </TableCell>
                    <TableCell>
                      {order.products.map((product) => (
                        <div>{product.name}</div>
                      ))}
                    </TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {loading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={order.status}
                            label="Status"
                            disabled={order.status === "pending"}
                            onChange={(event) => {
                              handleStatusUpdate(order._id, event.target.value);
                            }}
                          >
                            <MenuItem value={"pending"} disabled>
                              Pending
                            </MenuItem>
                            <MenuItem value={"paid"}>Paid</MenuItem>
                            <MenuItem value={"failed"}>Failed</MenuItem>
                            <MenuItem value={"completed"}>Completed</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>{order.paid_at}</TableCell>
                    <TableCell align="right">
                      {order.status === "pending" ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            handleOrderDelete(order._id);
                          }}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No order found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default OrdersPage;
