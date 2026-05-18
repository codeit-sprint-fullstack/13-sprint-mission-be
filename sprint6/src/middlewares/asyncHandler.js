// middlewares/asyncHandler.js
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // fn 실행하다가 에러나면 catch해서 next로 넘김
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
