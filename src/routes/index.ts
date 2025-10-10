import { Router } from "express";
import v1Routes from "./v1"; // Import versioned routes for v1

const router = Router();

// Mount versioned routes
router.use("/v1", v1Routes); // All v1 routes go under /v1

router.get("/v1/health", (_req, res) => {
  res.send("ok");
});

export default router; // apiRouter
