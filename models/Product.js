import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '상품명은 필수입니다.'],
      trim: true,
      minlength: [1, '상품명은 1자 이상이어야 합니다.'],
      maxlength: [10, '상품명은 10자 이하여야 합니다.'],
    },
    description: {
      type: String,
      required: [true, '상품 소개는 필수입니다.'],
      trim: true,
      minlength: [10, '상품 소개는 10자 이상이어야 합니다.'],
      maxlength: [100, '상품 소개는 100자 이하여야 합니다.'],
    },
    price: {
      type: Number,
      required: [true, '판매 가격은 필수입니다.'],
      min: [1, '판매 가격은 1 이상이어야 합니다.'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          return tags.every((tag) => tag.length <= 5);
        },
        message: '태그는 5글자 이하여야 합니다.',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
