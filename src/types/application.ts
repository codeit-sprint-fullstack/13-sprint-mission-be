export interface Requester {
    userId: number;
}

export type SortOrder = 'recent' | 'favorite';

export interface PageRequest {
    page: number;
    pageSize: number;
    keyword?: string;
}

export interface SortedPageRequest extends PageRequest {
    orderBy: SortOrder;
}

export interface CursorRequest {
    cursor?: number;
    limit: number;
}

export interface ArticleIdRequest {
    articleId: number;
}

export interface ProductIdRequest {
    productId: number;
}

export interface CommentIdRequest {
    commentId: number;
}

export interface ArticleInput {
    title: string;
    content: string;
    image?: string | null;
}

export type CreateArticleRequest = ArticleInput;
export type UpdateArticleRequest = ArticleIdRequest & Partial<ArticleInput>;

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
}

export type CreateProductRequest = ProductInput;
export type UpdateProductRequest = ProductIdRequest & Partial<ProductInput>;

export interface CommentInput {
    content: string;
}

export type CreateArticleCommentRequest = ArticleIdRequest & CommentInput;
export type CreateProductCommentRequest = ProductIdRequest & CommentInput;
export type UpdateCommentRequest = CommentIdRequest & CommentInput;

export type ArticleCommentListRequest = ArticleIdRequest & CursorRequest;
export type ProductCommentListRequest = ProductIdRequest & CursorRequest;

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest extends SignInRequest {
    nickname: string;
    passwordConfirmation: string;
}

export interface PasswordUpdateRequest {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
}

export interface ProfileUpdateRequest {
    image: string | null;
}

export interface AuthCodeRequest {
    code: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export type ApiListResponse<T> = {
    totalCount: number;
    list: T[];
};

export type ApiCursorResponse<T> = {
    list: T[];
    nextCursor: number | null;
};
