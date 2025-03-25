import { prisma } from "../config/db.js";
import ApiResponse from "../utils/ApiResponse.js";

export async function getExpenses(req, res) {
  try {
    const userId = req.userId;
    const expenses = await prisma.expense.findMany();
    ApiResponse.send(res, 200, `All user expenses`);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, "Internal Server Error");
  }
}
