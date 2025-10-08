# 🧾 **DTO (Data Transfer Object) – Complete Notes**

---

## 🧠 What Is a DTO?

**DTO** stands for **Data Transfer Object**.
It’s a **plain object** that defines _the structure, types, and constraints_ of data being transferred across layers of your app — usually between:

- The **client (frontend)** → **server (API)**
- The **controller/service layer** → **database**

DTOs act as a **contract** for data — they tell you what shape your data should have at each boundary.

---

### 🧩 Simple Example

#### Without a DTO:

A user could send _anything_ in a POST request:

```json
{
  "amount": "free",
  "userId": "abc",
  "isAdmin": true
}
```

😱 That’s dangerous — your DB expects numbers, not strings or random fields.

---

#### With a DTO (Zod Example)

```ts
const expenseCreateSchema = z.object({
  amount: z.number().gt(0),
  category: z.enum(["Groceries", "Utilities", "Leisure"]),
  description: z.string().max(255).optional(),
  date: z.date(),
  userId: z.number().int(),
});
```

Now your server can safely do:

```ts
const parsed = expenseCreateSchema.parse(req.body);
```

If the request body is invalid, it will throw a validation error **before hitting your business logic or DB.**

✅ Safe
✅ Predictable
✅ Maintainable

---

## 🎯 Why DTOs Are Important

| Purpose                    | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **Validation**             | Ensure incoming data matches what the server expects.                                |
| **Type Safety**            | Generate accurate TypeScript types directly from schemas.                            |
| **Separation of Concerns** | Keep your API’s request/response contracts separate from your database schema.       |
| **Security**               | Prevent clients from sending unsafe or unwanted fields (like `id`, `isAdmin`, etc.). |
| **Refactoring Safety**     | You can change DB structure without breaking the API contract.                       |

---

## 🧩 Example: Expense Module DTOs

```ts
// expense-schemas.ts
import * as z from "zod";
import * as schema from "@/db/schema";

const amountValidation = z.number().gt(0).lt(100_000_000);
const categoryValidation = z.enum(schema.CATEGORY_ENUM_VALUES);
const descriptionValidation = z.string().max(255).optional();

const dateValidation = z
  .string()
  .transform((str) => new Date(str))
  .refine((d) => !isNaN(d.getTime()), { message: "Invalid date format" });

export const expenseCreateSchema = z.object({
  amount: amountValidation,
  category: categoryValidation,
  description: descriptionValidation,
  date: dateValidation,
  userId: z.number().int(),
});

export const expenseUpdateSchema = z.object({
  amount: amountValidation.optional(),
  category: categoryValidation.optional(),
  description: descriptionValidation.optional(),
  date: dateValidation.optional(),
  userId: z.number().int().optional(),
});
```

---

## 🧱 DTO Folder Structure (Best Practice)

Keeping DTOs in a dedicated folder keeps your project clean and modular.

```
src/
│
├── db/                # drizzle / prisma schema
│   └── schema.ts
│
├── modules/
│   └── expense/
│       ├── expense.controller.ts
│       ├── expense.service.ts
│       ├── expense.routes.ts
│       ├── expense-schemas.ts   # ✅ your Zod DTOs
│       └── expense.types.ts     # ✅ inferred types (optional)
│
├── middlewares/
│   └── validateSchema.ts        # reusable Zod validation middleware
│
└── server.ts
```

If you have many modules (user, expense, report, etc.), each module can have its own DTO file under its directory.

---

## 🧩 Inferred Types (TypeScript Magic ✨)

When you define a Zod schema, you can **infer** a TypeScript type from it — meaning you don’t have to manually duplicate types.

```ts
export type ExpenseCreateDTO = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdateDTO = z.infer<typeof expenseUpdateSchema>;
```

Now these types can be used anywhere:

```ts
async function createExpense(data: ExpenseCreateDTO) {
  // `data` is guaranteed to have the same structure as the Zod schema
}
```

### 🧠 Why It’s Powerful:

- **Single source of truth** → You define your schema once, and TypeScript knows your types.
- **No drift** → If you change a field in the schema, the type updates automatically.
- **Eliminates bugs** → You can’t accidentally pass wrong data between layers.

---

## ⚙️ Middleware for Validation

You can create a reusable middleware to validate `req.body` using any Zod schema.

```ts
// middlewares/validateSchema.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); // ✅ parsed + type-safe
      next();
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }
  };
```

Usage example in routes:

```ts
import { Router } from "express";
import { validateSchema } from "@/middlewares/validateSchema";
import { expenseCreateSchema } from "./expense-schemas";
import * as controller from "./expense.controller";

const router = Router();

router.post("/", validateSchema(expenseCreateSchema), controller.createExpense);
router.patch(
  "/:id",
  validateSchema(expenseUpdateSchema),
  controller.updateExpense
);

export default router;
```

---

## 🧭 Full Flow: Request → Validation → Controller → Service → Response

Let’s visualize the **data flow** for a POST `/expenses` request:

```
[Frontend]
   ↓ (JSON payload)
[API Route → Middleware → Controller → Service → DB]
```

### Step-by-step:

1. **Frontend Request**

   ```json
   {
     "amount": 1500,
     "category": "Groceries",
     "description": "Weekly shopping",
     "date": "2025-10-08 12:30:00",
     "userId": 1
   }
   ```

2. **Express Route**

   - Route receives the request at `/api/expenses`
   - Calls middleware: `validateSchema(expenseCreateSchema)`

3. **Middleware Validation**

   - Parses and validates the `req.body`
   - If invalid → returns 400 error
   - If valid → attaches parsed, type-safe object to `req.body`

4. **Controller**

   ```ts
   export const createExpense = async (req, res) => {
     const data = req.body; // ✅ already validated DTO
     const expense = await expenseService.createExpense(data);
     res.status(201).json(expense);
   };
   ```

5. **Service Layer**

   ```ts
   export const createExpense = async (data: ExpenseCreateDTO) => {
     // Example business rule check
     if (data.amount > 1_000_000) {
       throw new Error("Amount exceeds limit");
     }

     // Save to DB using Drizzle
     return await db.insert(expensesTable).values(data).returning();
   };
   ```

6. **Response**

   - Returns created expense object
   - Or sends appropriate validation/business error

---

## ⚙️ Summary Cheat Sheet

| Concept           | Description                                                                  | Example                                 |
| ----------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **DTO**           | Data Transfer Object — defines what data is accepted/sent                    | `expenseCreateSchema`                   |
| **Purpose**       | Validation, type safety, data contract                                       | Input/Output between frontend & backend |
| **Zod Schema**    | Runtime validation layer                                                     | `z.object({ ... })`                     |
| **Inferred Type** | TypeScript type generated from schema                                        | `z.infer<typeof expenseCreateSchema>`   |
| **Middleware**    | Validates `req.body` using a DTO                                             | `validateSchema(expenseCreateSchema)`   |
| **Directory**     | Keep inside each module (`/modules/expense/expense-schemas.ts`)              | Clean separation                        |
| **Flow**          | Request → Middleware (Zod validation) → Controller → Service → DB → Response | Full backend flow                       |

---

## 💡 Pro Tip

You can also define **response DTOs**, not just request DTOs.

Example:

```ts
export const expenseResponseSchema = z.object({
  id: z.number(),
  amount: z.number(),
  category: z.string(),
  description: z.string().nullable(),
  date: z.date(),
  userId: z.number(),
});
```

Then use it to sanitize what data you send **back** to the client (e.g., exclude internal DB columns like `deletedAt`, etc.).

---

## 🏁 TL;DR — The DTO Workflow

```
Frontend Request
      ↓
[1] Middleware → validateSchema(ZodDTO)
      ↓
[2] Controller → receives parsed data
      ↓
[3] Service → applies business logic
      ↓
[4] Database → persist/retrieve data
      ↓
[5] Controller → send sanitized response DTO
```

---
