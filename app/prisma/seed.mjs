import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add your seed data here. Replace the values with your own data.
  const clients = [
    {
      clientId: "client1",
      clientSecret: "clientSecret1",
      redirectUris: ["https://example1.com/callback"],
      name: "Client 1",
      logoUrl: "https://example1.com/logo.png",
      logoUrlDark: "https://example1.com/logo_dark.png",
    },
    {
      clientId: "client2",
      clientSecret: "clientSecret2",
      redirectUris: ["https://example2.com/callback"],
      name: "Client 2",
      logoUrl: "https://example2.com/logo.png",
      logoUrlDark: "https://example2.com/logo_dark.png",
    },
  ];

  for (const clientData of clients) {
    await prisma.client.create({ data: clientData });
  }

  console.log("Seeding clients completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {
        console.log("Disconnected from database.");
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  });
