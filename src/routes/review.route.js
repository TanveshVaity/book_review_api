import { Router } from "express";
import { addReview, deleteReview, updateReview } from "../controllers/review.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", auth, addReview);
router.delete("/:reviewId", auth, deleteReview);
router.put("/:reviewId", auth, updateReview);

export default router;