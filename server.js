import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import generatePassword from "password-generator";
import { nanoid } from "nanoid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "your_secret_key";
const JSON_SERVER_URL = process.env.REACT_APP_JSON_SERVER_URL || "http://localhost:8001";

app.post("/google-login", async (req, res) => {
  const { email, name, surname, image } = req.body;

  try {
    const { data: users } = await axios.get(`${JSON_SERVER_URL}/users`);
    let user = users.find((u) => u.email === email);

    if (!user) {
      const newUser = {
        id: nanoid(),
        email,
        name,
        surname,
        password: generatePassword(12),
      };

      await axios.post(`${JSON_SERVER_URL}/users`, newUser);
      user = newUser;
    }

    const { password, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
