import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Todo API Server" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(notFound);
app.use(errorHandler);
