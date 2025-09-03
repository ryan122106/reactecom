import { useState } from "react";
import Header from "../components/Header";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { loginUser } from "../utils/api_user";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async (event) => {
    if (!email || !password) {
      toast.error("Please fill up the required fields");
      return;
    }
    const data = await loginUser(email, password);
    console.log(data);
  };

  return (
    <>
      <Header title="Login to your account" />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Card sx={{ width: 350 }}>
          <CardContent>
              <Typography>Email</Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Typography>Password</Typography>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, bgcolor: "blue" }}
                onClick={handleFormSubmit}
              >
                Login
              </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
