import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All"); // Just for UI, no filtering

  useEffect(() => {
    fetch("http://localhost:5123/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const categories = ["All", "Consoles", "Games", "Accessories", "Subscriptions"];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Dropdown + Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)} // keeps UI controlled
            sx={{ minWidth: 180 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="success">
            Add New
          </Button>
        </Box>
      </Box>

      {/* Product Grid (No filtering applied) */}
      <Grid container spacing={10}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Chip label={`$${product.price}`} color="success" />
                <Chip label={product.category} color="warning" />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Button variant="contained" color="primary">
                  Add To Cart
                </Button>
                <Box>
                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Products;
