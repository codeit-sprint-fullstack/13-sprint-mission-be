import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MOGODB_URI);
    console.log("DB연결에 성공했습니다.");
  } catch {
    console.error("DB연결에 실패했습니다.");
    process.exit(1);
  }
}
