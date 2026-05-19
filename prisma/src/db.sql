CREATE TABLE "article " (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL, 
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "comment" (
    "id" SERIAL PRIMARY KEY,
    "article_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- 게시글이 삭제되면 댓글도 자동 삭제되는 외래키 설정
        CONSTRAINT "comment_article_id_fkey" FOREIGN KEY ("article_id") 
        REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);



