import { PrismaClient } from "@prisma/client";

/**
 * @type {import("@prisma/client").Prisma.UserCreateInput[]}
 */
const userData = [
  {
    email: "user1@example.com",
    password: "password123",
    profile: {
      create: {
        name: "User One",
        currency: "INR"
      }
    },
    expenses: {
      create: [
        {
          amount: 50.75,
          category: "groceries",
          description: "Weekly grocery shopping",
          status: "COMPLETED",
          paymentDate: new Date("2025-03-25")
        },
        {
          amount: 20.0,
          category: "transport",
          description: "Bus fare",
          status: "COMPLETED",
          paymentDate: new Date("2025-03-26")
        },
      ],
    },
  },
  {
    email: "user2@example.com",
    password: "securepass456",
    profile: {
      create: {
        name: "User Two",
        currency: "USD"
      }
    },
    expenses: {
      create: [
        {
          amount: 100.0,
          category: "entertainment",
          description: "Movie tickets",
          status: "COMPLETED",
          paymentDate: new Date("2025-03-20")
        },
      ],
    },
  },
  {
    email: "user3@example.com",
    password: "mypassword789",
    profile: {
      create: {
        name: "User Three",
        currency: "EUR"
      }
    },
    expenses: {
      create: [
        {
          amount: 15.99,
          category: "coffee",
          description: "Morning coffee",
          status: "RECURRING",
          paymentDate: new Date("2025-03-30")
        },
        {
          amount: 200.5,
          category: "electronics",
          description: "Headphones",
          status: "COMPLETED",
          paymentDate: new Date("2025-03-15")
        },
      ],
    },
  },
];

async function seedUser() {
  const prisma = new PrismaClient();
  try {
    console.log(`Seeding Started ...`);
    for (const u of userData) {
      const existingUser = await prisma.user.findUnique({
        where: { email: u.email },
      });
      if (existingUser) {
        console.log(
          `User ${existingUser.email} already exists! Skipping ...`
        );
        continue; // Changed from return to continue to check all users
      }
      const newUser = await prisma.user.create({ 
        data: u,
        include: {
          profile: true,
          expenses: true
        }
      });
      if (!newUser) throw new Error(`Error creating User ${u.email}!`);
      console.log(`=> User ${newUser.email} created successfully with ${newUser.expenses.length} expenses!`);
    }
    console.log(`Seeding Completed Successfully!`);
  } catch (error) {
    console.error(`Error Seeding Database:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUser();