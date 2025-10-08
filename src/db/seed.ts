import { reset, seed } from "drizzle-seed";
import { db } from "./client";
import * as schema from "./schema";

async function seedData() {
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
      count: 100,
    },
    expensesTable: {
      columns: {
        amount: f.number({ minValue: 0, maxValue: 1000, precision: 2 }),
        category: f.valuesFromArray({
          values: [...schema.CATEGORY_ENUM_VALUES],
        }),
        date: f.datetime(),
      },
      count: 200000,
    },
  }));
  console.log(`=> Database Seeding Completed :)`);
}

// singleton call
seedData();
