import { useEffect, useState } from "react";
import { Box, Paper, Typography, Container, Button, TextField } from "@mui/material";
import Header from "../components/Header";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../utils/api_categories";
import Swal from "sweetalert2";
import { toast } from "sonner";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory) {
      return toast.error("Category label cannot be empty");
    }
    try {
      const created = await addCategory(newCategory);
      toast.success("Category added!");
      setCategories([...categories, created]);
      setNewCategory("");
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id);
          toast.success("Category deleted!");
          setCategories(categories.filter((c) => c._id !== id));
        } catch (error) {
          toast.error("Error deleting category");
        }
      }
    });
  };

  const handleEditCategory = (cat) => {
    setEditingId(cat._id);
    setEditingLabel(cat.label);
  };

  const handleUpdateCategory = async () => {
    if (!editingLabel) {
      return toast.error("Label cannot be empty");
    }
    try {
      const updated = await updateCategory(editingId, editingLabel);
      setCategories(
        categories.map((c) => (c._id === editingId ? updated : c))
      );
      toast.success("Category updated!");
      setEditingId(null);
      setEditingLabel("");
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  return (
    <Container>
      <Header title={"Categories"} />

      {/* Add new category */}
      <Paper
        style={{
          margin: 10,
          padding: 15,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TextField
          fullWidth
          label="Category Label"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddCategory}>
          Add
        </Button>
      </Paper>
      
      <Paper style={{ padding: 15, marginTop: 20 }}>
        <Typography variant="h5">
          Existing Categories
        </Typography>

        {categories.length === 0 && (
          <Typography variant="body1" align="center">
            No categories yet.
          </Typography>
        )}

        {categories.map((cat) => (
          <Paper
            key={cat._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              marginTop: 10,
            }}
          >
            {editingId === cat._id ? (
              <>
                <TextField
                  value={editingLabel}
                  onChange={(e) => setEditingLabel(e.target.value)}
                  size="small"
                />
                <Box>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleUpdateCategory}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditingId(null)}
                    style={{ marginLeft: 8 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6">{cat.label}</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditCategory(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteCategory(cat._id)}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        ))}
      </Paper>
    </Container>
  );
}

export default CategoriesPage;
