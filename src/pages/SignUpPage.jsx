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
import { SignUpUser } from "../utils/api_user";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const data = await SignUpUser(name, email, password);
    console.log(data);
  };

  return (
    <>
      <Header title="Create a New Account" />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Card sx={{ width: 350 }}>
          <CardContent>
              <Typography>Name</Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

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
                sx={{ mb: 3 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Typography>Confirm Password</Typography>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, bgcolor: "blue" }}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SignUpPage;
