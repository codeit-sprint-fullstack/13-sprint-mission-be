# 🛒 Backend REST API Server

이 프로젝트는 Node.js 기반의 백엔드 서버로, REST API를 통해 상품 데이터를 관리할 수 있도록 구현되었습니다.

---

## 🚀 프로젝트 소개

상품 생성, 조회, 수정 기능을 제공하는 REST API 서버입니다.  
MongoDB를 데이터베이스로 사용하며, Render를 통해 배포되었습니다.

---

## 🛠️ 기술 스택

- Node.js
- Express
- MongoDB
- Mongoose
- REST API
- dotenv

---

## 📦 주요 기능

- 상품 생성 API (POST)
- 상품 전체 조회 API (GET)
  - 검색 기능 (name, description)
  - 정렬 기능 (최신순)
  - 페이지네이션 (offset / limit)
- 상품 상세 조회 API (GET)
- 상품 수정 API (PATCH)
- 상품 삭제 API (DELETE)

---

## 🧪 API 테스트

REST Client를 사용하여 API 테스트를 진행했습니다.

예시:

```http
GET /products?sort=recent&keyword=노트북&offset=0&limit=10
```

## 🗄️ 데이터베이스
- MongoDB Atlas를 사용하여 데이터 저장
- Mongoose를 통해 스키마 기반으로 데이터 관리

## 🌐 배포
- Render를 이용하여 서버 배포
- 배포 환경에서도 MongoDB 연결하여 정상 동작 확인

## 📁 프로젝트 구조
```
controllers/
models/
app.js
db.js
seed.js
```