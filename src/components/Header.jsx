import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Link } from "react-router";

const Header = ({ title }) => {
  return (
    <Box
      sx={{
        py: 4,
        textAlign: "center",
        borderBottom: "1px solid #ddd",
        mb: 3,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "700",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button component={Link} to={"/"} variant={title === "Welcome to My Store" ? "contained" : "outlined"} sx={{ mr: 4 }}>
          Home
        </Button>
        <Button component={Link} to={"/products/cart"} variant={title === "Cart" ? "contained" : "outlined"} sx={{ mr: 4 }}>
          Cart
        </Button>
        <Button component={Link} to={"/orders"} variant={title === "My Orders" ? "contained" : "outlined"} sx={{ mr: 4}}>
          My Orders
        </Button>
        <Button component={Link} to={"/categories"} variant={title === "Categories" ? "contained" : "outlined"}>
          Categories
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
