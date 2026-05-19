/**
 * 비동기 컨트롤러 함수를 감싸서 자동으로 에러를 next()로 전달하는 유틸리티
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next) 실행 결과를 Promise로 감싸고, 에러 발생 시 catch(next)로 넘김
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
