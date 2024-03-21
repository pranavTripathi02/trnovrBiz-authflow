import { db } from "@/server/db";
import {faker} from "@faker-js/faker"

async function main() {
    for(let i=0; i<10; i++) {
    const userName = faker.person.fullName()
    const userEmail = faker.internet.email()
    const loginDate = faker.date.recent()
      await db.user.upsert({
        where: { email:  userEmail},
        update: {},
        create: {
          isVerified: true,
          email: userEmail,
          lastLogin: loginDate,
          name: userName,
          password: faker.internet.password({length:12})
        },
      });
    }
    for(let i=0; i<20; i++) {
    const product = faker.commerce.productAdjective();
      await db.category.upsert({
          where: {name:product},
          update:{},
          create:{
              name: product,
          }
      })
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
