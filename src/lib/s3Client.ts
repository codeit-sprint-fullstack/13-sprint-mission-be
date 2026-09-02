import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import fs from "fs";
require("dotenv").config(); // .env 내용 읽을 수 있게 설정

const filePath = "./blog-image.png"; // 파일 경로
const fileStream = fs.createReadStream(filePath); // 파일 객체 가져오기

const bucketName =
  "panda-market-s3-bucket-260824-055111818373-ap-northeast-2-an";
const region = "ap-northeast-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const params = {
  Bucket: bucketName,
  Key: "imgs/blog-image.png", // 버킷 내 이미지 저장 경로
  Body: fileStream,
  ContentType: "image/png",
};

const command = new PutObjectCommand(params); // 파일 업로드용 명령 생성

s3.send(command)
  .then((data: PutObjectCommandOutput) => {
    console.log("Object uploaded successfully:", data);
  })
  .catch((err: any) => {
    console.log("Error uploading object:", err.message);
  });
