# Notes on Global Error Handling & Zod Validation Middleware

### 1. **Global Error Handling: Why & How?**

- Centralizes all error responses in one middleware.
- Simplifies controllers by removing repetitive try/catch blocks.
- Handles known error types (e.g., `ZodError`, `DrizzleError`) consistently.
- Allows:

  - Uniform error response formatting.
  - Centralized logging and metrics.
  - Easier maintenance and extensibility.

### 2. **Controller Structure with Global Error Handling**

- Controllers **do not** catch errors locally.
- Errors thrown or rejected in async calls bubble up to the global handler.
- Controllers only focus on happy path logic.

### 3. **Express Global Error Middleware**

- Signature: `(err, req, res, next) => { ... }`
- Use `instanceof` or custom error classes to handle specific errors.
- Return appropriate HTTP status codes and formatted JSON responses.
- Fallback to 500 Internal Server Error for unknown errors.

---

### 4. **Zod Validation Middleware**

- Must validate request data (`req.body`, etc.) before controller logic.
- Validation errors (`ZodError`) should be passed to the global error handler, not handled locally.

---

### 5. **Validation Method Options**

| Method                    | Throws Error? | Async? | Needs Try/Catch? | Notes                        |
| ------------------------- | ------------- | ------ | ---------------- | ---------------------------- |
| `schema.parse()`          | Yes           | No     | Yes              | Synchronous validation       |
| `schema.safeParse()`      | No            | No     | No               | Returns `{ success, error }` |
| `schema.parseAsync()`     | Yes           | Yes    | Yes              | For async refinements        |
| `schema.safeParseAsync()` | No            | Yes    | No               | Cleaner async flow           |

---

### 6. **Middleware Implementation**

- **With `parse()` or `parseAsync()`**: wrap in `try/catch` and call `next(error)` on failure.
- **With `safeParse()` or `safeParseAsync()`**: check result; if failure, call `next(error)`; else call `next()`.

---

### 7. **Never remove `next(error)` in middleware**

- Removing `next(error)` or response inside the `catch` block causes the request to hang indefinitely.
- Always pass errors to the global handler for consistent error management.

---

### 8. **Summary: Best Practice**

- Use **global error handler** to handle all error types.
- Keep validation middleware minimal: validate → on error call `next(error)`.
- Controllers focus on business logic without error handling clutter.
- Use appropriate Zod validation method depending on whether schema uses async checks.

---
