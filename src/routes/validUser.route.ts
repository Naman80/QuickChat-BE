import { Router } from "express";

const router = Router();

router.get("/valid-user", (req, res) => {
  try {
    //@ts-ignore
    const { user } = req;

    if (!user) throw new Error("User not found");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid user",
    });
  }
});

export default router;
