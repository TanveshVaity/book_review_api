import { Book } from '../models/book.model.js';
import { Review } from '../models/review.model.js';

const addReview = async(req, res) =>{
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { rating, comment } = req.body;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const review = await Review.create({
            rating,
            comment,
            book: id,
            user: userId,
        });
        res.status(201).json({
            review,
            message: "Review added successfully",
        });        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


const deleteReview = async(req, res) =>{
    const { id, reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);   
    if (!review) {
        return res.status(404).json({message: "Review not found"});
    }

    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await Review.findByIdAndDelete(id);
    res.status(200).json({
        message: "Review deleted successfully"
    })
}

const updateReview = async(req, res) =>{
    const { id, reviewId } = req.params;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    if(rating !== undefined) {
        review.rating = rating;
    }
    if(comment !== undefined) {
        review.comment = comment;
    }
    await review.save();

    res.status(200).json({
        review,
        message: "Review updated successfully"
    });
}

export { addReview, deleteReview, updateReview };