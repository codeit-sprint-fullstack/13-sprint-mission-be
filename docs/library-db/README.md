# Library DB Submission Files

## 제출 캡처 3가지

1. 개념적 스키마: `conceptual.drawio`를 draw.io에서 열고 캡처
2. 논리적 스키마: `schema.prisma` 내용을 https://prisma-editor.bahumaish.com/ 에 붙여넣고 캡처
3. 물리적 스키마: `schema.sql`을 PostgreSQL DB에 실행한 뒤 DBeaver ER Diagram 캡처

## 관계

- 회원 1명은 여러 대출 기록을 가질 수 있다.
- 도서 1권은 시간대가 다르면 여러 대출 기록을 가질 수 있다.
- 대출 기록은 회원 1명과 도서 1권에 반드시 연결된다.

## NOT NULL / PK / FK

- `Member.id`, `Book.id`, `Loan.id`: PK
- `Loan.memberId`: FK -> `Member.id`, NOT NULL
- `Loan.bookId`: FK -> `Book.id`, NOT NULL
- 필수 정보인 이름, 이메일, 전화번호, 제목, 저자, ISBN, 출판연도, 대출일, 반납예정일은 NOT NULL
- 실제 반납일은 아직 반납하지 않은 상태를 표현해야 하므로 NULL 허용
