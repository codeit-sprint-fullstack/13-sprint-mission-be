//.env 파일 로드 먼저
import dotenv from "dotenv";
dotenv.config();

//
import express from "express";
import connectDB from "./db.js";
import Product from "./models/Product.js";
// import mongoose from "mongoose";// db.js 로 연결 하였기때문에 직접 연결 필요 xxx
import cors from "cors";

// express 세팅 하기
const app = express();
app.use(cors()); // cors 적용
app.use(express.json());

// MongoDB 연결
connectDB();

// 포트 번호 설정
const PORT = process.env.PORT || 3000; // 환경변수로 포트번호 설정하기

// 판다마켓 랜딩페이지 홈
app.get("/", (req, res) => {
  res.json("판다마켓 랜딩페이지 얍");
});

//판다마켓 상품 목록 조회 API (검색, 정렬, 페이지네이션)
app.get("/items", async (req, res) => {
  try {
    const { offset = 0, limit = 10, search = "", sort = "recent" } = req.query;

    // 검색 필터 id, name, description 단어 포함된 것만
    const filter = search
      ? {
          $or: [
            // 둘중 하나라도 만족하면 조회를 한다
            { name: { $regex: search, $options: "i" } }, // $regex: 부분일치, $options:"i" 대소문자 구분 없이
            { description: { $regex: search, $options: "i" } }, // 상품 설명에 해당하는 단어가 포함되면 대소문자 구분 없이 서치 했을때 상품이 나온다 //위에도 동일
          ],
        }
      : {}; // 검색이 없으면 전체 리스트 모두 조회하기
    //정렬 최신순 (recent)
    const sortOption = sort === "recent" ? { createdAt: -1 } : {};
    //  쿼리 파라미터 sort 정렬 createdAt 기준으로 내림차순 (-1) 최신순 (1이면 오래된 순), default =  정렬조건 없음

    // 페이지네이션 - offset으로 부터 limit 개수만큼
    // //필드선택 - name, price, createdAt 이렇게만 반환한다
    const items = await Product.find(filter) // 29~37번줄 검색 조건 적용해서 서치
      .sort(sortOption) // 39번줄 정렬 조건 반영
      .skip(Number(offset)) // 건너 뛴다 (offset=10 이면 앞 10개 생략)
      .limit(Number(limit)) // 한번에 최대 몇개까지 가져올 것인지 정한다 (limit=10 이면 최대 10개까지만)
      .select("id name price createdAt"); // 이 데이터만 브라우저에 보낼것

    const totalCount = await Product.countDocuments(filter);
    res.json({ totalCount, items });
    // console.log("상품 목록 데이터 받기 얍!!!"); // 개발모드에서 확인 후 제거 필수 모니터링 어려워짐
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//판다마켓 상품 상세 조회 API
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params; // url 에서 id 값을 가져온다
    const item = await Product.findById(id) // Product 에서 해당 id 상품 찾기
      .select(
        // .select() 이 필드에만 응답에 포함한다
        "id name description price tags createdAt",
      );

    if (!item) {
      // 상품이 없으면 검색 결과가 null 이면 404에러로 응답
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." }); // return 값 없으면 404 오류 보내도 아래 코드 계속 실행 위험
    }
    // 상품이 있으면 상품 정보를 json 형태로 응답 (기본 status=200)
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message }); // 코드에 문제가 생기거나 DB 접속 실패시 500 에러처리
  }
});

//판다마켓 상품 등록 API
app.post("/items", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "name, price, description 입력은 필수입니다" });
    }
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        message: "가격은 0보다 큰 숫자여야 해요.",
      });
    }

    const newItem = new Product({ name, description, price, tags });
    await newItem.save();

    res.status(201).json(newItem);
    // console.log(req.body);// 디버그 완료후에는 제거 필수 민감한 데이터가 서버 로그에 남을 수 있음
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//판다마켓 상품 수정 API
app.patch("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //DB에서 상품 찾아오기
    const item = await Product.findByIdAndUpdate(id, req.body, { new: true });

    // id에 상품이 없는 경우는 404 반환
    if (!item) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//판다마켓 상품 삭제 API
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteItem = await Product.findByIdAndDelete(id);

    if (!deleteItem) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요!`);
});
