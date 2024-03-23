import { db } from "@/server/db";
import { faker } from "@faker-js/faker";

async function main() {
  let i = 0;
  while ((await db.category.count()) < 100 && i < 200) {
    const product = faker.commerce.productAdjective();
    await db.category.upsert({
      where: { name: product },
      update: {},
      create: {
        name: product,
      },
    });
    i++;
  }
}
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
