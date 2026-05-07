import dotenv from "dotenv";
import express from "express";
import { nanoid } from "nanoid";
import connectDB from "./db.js";

// .env 파일 로드 (반드시 다른 코드보다 먼저!)
dotenv.config();

const app = express();
app.use(express.json());

// MongoDB 연결
connectDB();
