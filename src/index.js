import { config as configDotenv } from "dotenv";

// Ensure NODE_ENV is set, fallback to `.env`
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
configDotenv({ path: envFile });

import app from "./app.js";

const port = process.env.PORT;
if (!port) {
  throw new Error(`Error loading port variable from environemnt variables.`);
}

app.listen(port, () => {
  console.log(`🖥️  Server is running at port ${port}...`);
});
