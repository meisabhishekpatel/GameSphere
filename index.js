import React from "react";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// import { MongoClient, ServerApiVersion } from 'mongodb';
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import userRoutes from "./routes/users.js";
import { verifyToken } from "./middleware/auth.js";
import postRoutes from "./routes/post.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
// app.use(helmet.crossOriginEmbedderPolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("assests", express.static(path.join(__dirname, "public/assets")));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


app.post("/auth/register", upload.single("picture"), verifyToken, register)
app.post("/posts", verifyToken, upload.single("picture").apply, createPost);


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

mongoose.set('strictQuery', false);
const PORT = 27017 || 6001;
// mongoose.connect("mongodb+srv://gamingdummy:Hello69@#@cluster0.te4t38y.mongodb.net/?retryWrites=true&w=majority",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
mongoose.connect("mongodb://127.0.0.1:27017/gaming_realm")
    .then(() => {
        app.listen(27017, () => console.log("Server Port:" + PORT));
    })
    .catch((error) => console.log(error));

