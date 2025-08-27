import { useState, useEffect } from "react";
import Header from "../components/Header";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getOrders, updateOrder, deleteOrder } from "../utils/api_orders";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data))
      .catch((error) => console.log(error));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      setOrders((p) =>
        p.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders((e) => e.filter((order) => order._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header title="My Orders" />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    {order.customerName} <br />
                    <small>({order.customerEmail})</small>
                  </TableCell>
                  <TableCell>
                    {order.products.map((p) => (
                      <div>
                        {p.name}
                      </div>
                    ))}
                  </TableCell>

                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      size="small"
                      disabled={order.status === "pending"}
                    >
                       {order.status === "pending" && (
                        <MenuItem value="pending">Pending</MenuItem>
                      )}

                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {order.status !== "pending" && order.paid_at ?
                      new Date(order.paid_at).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {order.status === "pending" && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default OrdersPage;
