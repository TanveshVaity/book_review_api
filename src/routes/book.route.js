import { Router } from "express";
import { getBooks, addBook, getBookById, searchBooks } from "../controllers/book.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add", auth, addBook);
router.get("/", getBooks);
router.get("/search", searchBooks)
router.get("/:id", getBookById);

export default router;