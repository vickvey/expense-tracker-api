import { configDotenv } from "dotenv";
configDotenv();
import app from "./app.js";

const PORT = process.env.PORT || 8079;

app.listen(PORT, () => {
  console.log(`🖥️  Server is running at port ${PORT} ...`);
});
