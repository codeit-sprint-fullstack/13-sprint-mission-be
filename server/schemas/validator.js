/**
 * 문자열이 유효하지 않은지(비어있거나, 타입이 다르거나, 길이를 벗어나는지) 확인합니다.
 */
exports.isInvalidString = (str, min, max = Infinity) => {
  return (
    !str ||
    typeof str !== "string" ||
    str.trim().length < min ||
    str.length > max
  );
};

/**
 * 숫자가 유효하지 않은지 확인합니다.
 */
exports.isInvalidNumber = (num) => {
  return (
    num === undefined ||
    num === null ||
    String(num).trim() === "" ||
    isNaN(Number(num))
  );
};
