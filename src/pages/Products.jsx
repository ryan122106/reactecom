import { Link } from "react-router";
import { Button } from "@mui/material";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../utils/api_products";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { addToCart } from "../utils/cart";
import { getCategories } from "../utils/api_categories";
import { API_URL } from "../utils/constants";

const Products = () => {
  // to store the data from /products
  const [products, setProducts] = useState([]);
  // to track which page the user is in
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts(category, page).then((data) => {
      setProducts(data);
    });
  }, [category, page]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  const handleProductDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this product?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // once user confirm, then we delete the product
      if (result.isConfirmed) {
        // delete product at the backend
        await deleteProduct(id);

        // method #1: remove from the state manually
        // delete product from the state
        // setProducts(products.filter((p) => p._id !== id));

        // method #2: get the new data from the backend
        const updatedProducts = await getProducts(category, page);
        setProducts(updatedProducts);

        toast.success("Product has been deleted");
      }
    });
  };

  return (
    <>
      <Header current="home" />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
            }}
          >
            Products
          </Typography>
          <Button
            component={Link}
            to="/products/new"
            variant="contained"
            color="success"
          >
            Add New
          </Button>
        </Box>
        <Box
          sx={{
            paddingBottom: "10px",
          }}
        >
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Filter By Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Genre"
              onChange={(event) => {
                setCategory(event.target.value);
                // reset the page back to 1
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem value={cat._id}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    API_URL +
                    (product.image
                      ? product.image
                      : "uploads/default_image.png")
                  }
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ minHeight: "64px" }}>
                    {product.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                    }}
                  >
                    <Chip label={"$" + product.price} color="success" />
                    <Chip
                      label={product.category ? product.category.label : ""}
                      color="primary"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ display: "block", px: 3, pb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                      marginLeft: "0px !important",
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/products/${product._id}/edit`}
                      variant="contained"
                      color="info"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleProductDelete(product._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {products.length === 0 ? (
          <Typography variant="h5" align="center" py={3}>
            No more products found.
          </Typography>
        ) : null}
        <Box
          sx={{
            pt: 2,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1 ? true : false} // the button will be disabled if the page is 1
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page: {page}</span>
          <Button
            variant="contained"
            disabled={products.length === 0 ? true : false} // the button will be disabled if no more products
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Products;
