import app from "./app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Server is listening on port ${PORT}`);
  console.log(`🏡 Environment: http://localhost:${PORT}`);
  console.log(`=============================================`);
});
