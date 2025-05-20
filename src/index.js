import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));


app.get("/", (req, res) => {
  res.send("Hello World!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});