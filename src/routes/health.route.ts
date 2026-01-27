import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  console.log("request at test route");
  res.status(200).json("server is up");
});

export default router;
