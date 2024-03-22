// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const categories = ctx.db.category.findMany({});
    return categories;
  }),
});
