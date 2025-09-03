import { useState, useEffect } from "react";
import Header from "../components/Header";
import Container from "@mui/material/Container";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Edit, Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {
  getCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
} from "../utils/api_categories";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCatID, setSelectedCatID] = useState("");
  const [selectedCatLabel, setSelectedCatLabel] = useState("");

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  const handleAddNew = async () => {
    if (label === "") {
      toast.error("Please fill up the label");
    } else {
      // add new category
      await addNewCategory(label);
      // get the latest categories again
      const newCategories = await getCategories();
      // update the categories state
      setCategories(newCategories);
      // clear the label
      setLabel("");
      toast.info("New category has been added");
    }
  };

  const handleUpdate = async () => {
    // prompt the user to update the new label for the selected category (pass in the current value)
    // const newCategoryLabel = prompt(
    //   "Please enter the new label for the selected category.",
    //   category.label
    // );
    // update category
    await updateCategory(selectedCatID, selectedCatLabel);
    // get the latest categories again
    const newCategories = await getCategories();
    // update the categories state
    setCategories(newCategories);
    // close the model
    setOpen(false);
    toast.info("Category has been updated");
  };

  const handleDelete = async (category) => {
    Swal.fire({
      title: "Are you sure you want to delete this category?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // once user confirm, then we delete the product
      if (result.isConfirmed) {
        await deleteCategory(category._id);
        // get the latest categories again
        const newCategories = await getCategories();
        // update the categories state
        setCategories(newCategories);
        toast.info("Category has been deleted");
      }
    });
  };

  return (
    <>
      <Header current="categories" title="Manage Categories" />
      <Container maxWidth="lg">
        <Typography variant="h4">Manage Categories</Typography>
        <Paper
          elevation={3}
          sx={{
            p: "20px",
            mt: "20px",
          }}
        >
          <InputLabel>Add New Category</InputLabel>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              mt: "5px",
            }}
          >
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
            <Button color="primary" variant="contained" onClick={handleAddNew}>
              Add
            </Button>
          </Box>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            p: "20px",
            mt: "20px",
          }}
        >
          <InputLabel>Existing Categories ({categories.length})</InputLabel>
          <List sx={{ width: "100%" }}>
            {categories.map((category) => (
              <ListItem
                key={category._id}
                disableGutters
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      onClick={() => {
                        setOpen(true);
                        // pass in the id and label
                        setSelectedCatID(category._id);
                        setSelectedCatLabel(category.label);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={`${category.label}`} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={selectedCatLabel}
              onChange={(event) => setSelectedCatLabel(event.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                pt: 2,
              }}
            >
              {" "}
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default CategoriesPage;
