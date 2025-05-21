import mongoose, { Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

//define the review schema
const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{
    timestamps: true,
});

reviewSchema.plugin(mongooseAggregatePaginate);
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);