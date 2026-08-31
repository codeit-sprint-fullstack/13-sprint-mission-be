// listProductComments / listArticleComments 는 작성자 정보 없이 이 필드만 select한다.
export interface ProductCommentListItem {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
}

export interface ArticleCommentListItem {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
}
