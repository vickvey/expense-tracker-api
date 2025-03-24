import { PrismaClient } from "@prisma/client";

/**
 * @type {import("@prisma/client").Prisma.UserCreateInput[]}
 */
const userData = [
  {
    email: "user1@example.com",
    password: "password123",
    expenses: {
      create: [
        {
          amount: 50.75,
          category: "groceries",
        },
        {
          amount: 20.0,
          category: "transport",
        },
      ],
    },
  },
  {
    email: "user2@example.com",
    password: "securepass456",
    expenses: {
      create: [
        {
          amount: 100.0,
          category: "entertainment",
        },
      ],
    },
  },
  {
    email: "user3@example.com",
    password: "mypassword789",
    expenses: {
      create: [
        {
          amount: 15.99,
          category: "coffee",
        },
        {
          amount: 200.5,
          category: "electronics",
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
          `User ${existingUser.email} already existing! Skipping ...`
        );
        return;
      }

      const newUser = await prisma.user.create({ data: u });
      if (!newUser) throw new Error(`Error creating User ${u.email}!`);

      console.log(`=> User ${newUser.email} created successfully!`);
    }

    console.log(`Seeding Completed Successfully!`);
  } catch (error) {
    console.error(`Error Seeding Database`, error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUser();
