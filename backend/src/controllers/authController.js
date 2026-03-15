import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserForLogin } from "../models/usermodel.js";

export const register = async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(username, email, hashedPassword);

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });

  } catch (err) {

    res.status(500).json({ message: "Registration failed" });

  }

};

export const login = async (req, res) => {

  try {

    const { identifier, password } = req.body;

    const user = await findUserForLogin(identifier);

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch {

    res.status(500).json({ message: "Login failed" });

  }

};