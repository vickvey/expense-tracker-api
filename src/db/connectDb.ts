import { db } from "./client";

export const connectDb = async () => {
  try {
    await db.$client.execute("SELECT 1"); // Basic test query
    console.log("=> => Connected to the database :) Hurrah!\n\n");
  } catch (error) {
    console.log("Database connection failed: ", error);
    throw error; // Rethrow error to be caught in server.ts
  }
};
