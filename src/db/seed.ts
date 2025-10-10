import "dotenv/config";
import { seed, reset } from "drizzle-seed";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";

async function seedData() {
  const db = drizzle(process.env.DB_FILE_NAME!);
  console.log(`=> Started Database Seeding ...`);
  await reset(db, schema);
  console.log(`=> Database Reset Completed!!`);
  await seed(db, schema).refine((f) => ({
    usersTable: {
      columns: {
        email: f.email(),
        role: f.valuesFromArray({
          values: [
            { weight: 0.99, values: ["standard"] },
            { weight: 0.01, values: ["admin"] },
          ],
        }),
      },
      count: 50,
    },
    expensesTable: {
      columns: {
        amount: f.number({ minValue: 0, maxValue: 1000, precision: 2 }),
        category: f.valuesFromArray({
          values: [...schema.CATEGORY_ENUM_VALUES],
        }),
        date: f.datetime(),
      },
      count: 2000,
    },
  }));
  console.log(`=> Database Seeding Completed :)`);
}

// singleton call
seedData();
