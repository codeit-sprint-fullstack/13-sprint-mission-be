export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).json({ message: e.message });
      } else if (e.code === "P2025") {
        res.status(404).json({ message: "요청한 데이터를 찾을 수 없어요." });
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  };
};
