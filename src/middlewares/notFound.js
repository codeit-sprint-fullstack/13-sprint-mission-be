const notFound = (req, res) => {
  res.status(404).json({
    message: "존재하지 않는 경로입니다.",
  });
};

export default notFound;
