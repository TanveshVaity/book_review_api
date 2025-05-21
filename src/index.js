import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";

// import routes
import userRoute from "./routes/user.route.js";
import bookRoute from "./routes/book.route.js";
import reviewRoute from "./routes/review.route.js";

dotenv.config({
  path: './.env'
})
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes declaration
app.use("/api/v1/users", userRoute);
app.use("/api/v1/books", bookRoute);
app.use("/api/v1/books/:id/reviews", reviewRoute);

const PORT = process.env.PORT || 5000;
connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error(`Error connecting to the database: ${error.message}`);
});