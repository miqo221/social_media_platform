import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:8001";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.get(`${JSON_SERVER_URL}/users`);
    const users = response.data;

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
