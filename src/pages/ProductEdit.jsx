import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { updateProduct, getProduct } from "../utils/api_products";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Chip from "@mui/material/Chip";
import { uploadImage } from "../utils/api_image";
import { API_URL } from "../utils/constants";
import { getCategories } from "../utils/api_categories";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ProductEdit = () => {
  const { id } = useParams(); // retrieve the id from the URL
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // load the product data from the backend API, and assign it the state
  useEffect(() => {
    getProduct(id)
      .then((productData) => {
        // check if productData is empty or not
        if (productData) {
          // update the state with the productData
          setName(productData ? productData.name : "");
          setDescription(productData ? productData.description : "");
          setPrice(productData ? productData.price : 0);
          setCategory(productData ? productData.category : "");
          setImage(productData ? productData.image : null);
        } else {
          // if not available, set error message
          setError("Product not found");
        }
      })
      .catch((error) => {
        // catch the API error
        setError("Product not found");
      });
  }, [id]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  const handleFormSubmit = async (event) => {
    // 1. check for error
    if (!name || !price || !category) {
      toast.error("Please fill up the required fields");
    }

    try {
      // 2. trigger the API to update product
      await updateProduct(id, name, description, price, category, image);

      // 3. if successful, redirect user back to home page and show success message
      toast.success("Product has been updated");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // if error, return the error
  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h3" align="center" mb={2} color="error">
            {error}
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/">
            Go back to Home
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Edit Product
        </Typography>
        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            value={description}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="number"
            label="Price"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Genre"
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              {categories.map((cat) => (
                <MenuItem value={cat._id}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {image ? (
            <>
              <img src={API_URL + image} width="200px" />
              <Button
                color="info"
                variant="contained"
                size="small"
                onClick={() => setImage(null)}
              >
                Remove
              </Button>
            </>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput
                type="file"
                onChange={async (event) => {
                  const data = await uploadImage(event.target.files[0]);
                  // { image_url: "uploads/image.jpg" }
                  // set the image url into state
                  setImage(data.image_url);
                }}
                accept="image/*"
              />
            </Button>
          )}
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Update
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ProductEdit;
