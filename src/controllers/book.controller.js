import { Book } from '../models/book.model.js';
import { Review } from '../models/review.model.js';
import mongoose from 'mongoose';

const addBook = async (req, res) => {
    try {
        const { title,description, author, genre, publishedYear} = req.body;

        const newBook = new Book({
            title,
            description,
            author,
            genre,
            publishedYear,
            user: req.user._id
        })
        await newBook.save();

        res.status(201).json({
            newBook,
            message: "Book added successfully",
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getBooks = async(req, res) =>{
    try {
        const { page = 1, limit = 10, author, genre } = req.query;
        const filter = {};
        if (author) filter.author = author;
        if (genre) filter.genre = genre;

        const options = {
            page : parseInt(page),
            limit : parseInt(limit),
            sort : { createdAt : -1 },
        }

        const books = await Book.aggregatePaginate(
            Book.aggregate([
               { $match: filter },
            ]), options);

        res.status(200).json({
            books,
            message: "Books fetched successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        // Get book with owner info
        const book = await Book.findById(id)
            .populate('user', 'username')

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        // Get reviews with pagination and user info
        const [reviews, totalReviews] = await Promise.all([
            Review.find({ book: id })
                .populate('user', 'username')
                .select('-__v -book')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ book: id })
        ]);

        const totalPages = Math.ceil(totalReviews / limit);
        const allReviews = await Review.find({ book: id }).select('rating');
        const averageRating = allReviews.length > 0 
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length 
            : 0;

        res.json({
            data: {
                book: {
                    ...book.toObject(),
                    averageRating: averageRating.toFixed(2),
                },
                reviews: {
                    items: reviews,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: totalReviews,
                        itemsPerPage: limit
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Server error" 
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { title, author, page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Validate at least one search parameter
        if (!title && !author) {
            return res.status(400).json({
                success: false,
                message: "Please provide a title or author to search"
            });
        }

        // Build search query
        const query = {};
        if (title && author) {
            query.$or = [
                { title: { $regex: title, $options: 'i' } },
                { author: { $regex: author, $options: 'i' } }
            ];
        } else if (title) {
            query.title = { $regex: title, $options: 'i' };
        } else {
            query.author = { $regex: author, $options: 'i' };
        }

        // Execute search with pagination
        const [books, total] = await Promise.all([
            Book.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            
            Book.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                results: books,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1
                }
            },
            message: books.length > 0 
                ? "Books found successfully" 
                : "No books matching your search"
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export { getBooks, addBook, getBookById, searchBooks };