import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ offset: z.number() }))
    .query(async ({ input, ctx }) => {
      const { offset } = input;
      const categories = await ctx.db.category.findMany({
        take: 6,
        skip: offset,
      });
      const count = await ctx.db.category.count();
      return { categories, count };
    }),
  userCategoryToggle: protectedProcedure
    .input(z.object({ categoryId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { categoryId } = input;
      const indexExists = await ctx.db.userToCategories.findUnique({
        where: {
          userId_categoryId: {
            categoryId,
            userId: ctx.user.userId,
          },
        },
      });
      if (indexExists) {
        await ctx.db.userToCategories.delete({ where: { id: indexExists.id } });
        return { message: "relation deleted" };
      } else {
        await ctx.db.userToCategories.create({
          data: { categoryId, userId: ctx.user.userId },
        });
        return { message: "relation created" };
      }
    }),
});
