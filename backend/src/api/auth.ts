import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

router.post("/google", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

router.post("/logout", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

router.get("/me", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

export default router;
