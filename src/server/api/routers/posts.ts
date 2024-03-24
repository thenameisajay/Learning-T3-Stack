import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/backend/dist/types/api/resources/User";

import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

/*  Note :
 * import type { User } from "@clerk/nextjs/dist/api - No longer exists
 *  import type { User } from "@clerk/backend/dist/types/api/resources/User" - New import
 */

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    userName: user.username,
    profilePicture: user.imageUrl,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    console.log("Users", users);

    // This won't work because post authorID is not the same as user ID ever
    // return posts.map((post) => ({
    //   ...post,
    //   author: users.find((user) => user.id === post.authorId),
    // }));
    return posts;
  }),
});

// create: publicProcedure
//   .input(z.object({ name: z.string().min(1) }))
//   .mutation(async ({ ctx, input }) => {
//     // simulate a slow db call
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     return ctx.db.post.create({
//       data: {
//         name: input.name,
//       },
//     });
//   }),

// getLatest: publicProcedure.query(({ ctx }) => {
//   return ctx.db.post.findFirst({
//     orderBy: { createdAt: "desc" },
//   });
// }),

create: privateProcedure
  .input(
    z.object({
      content: z.string().emoji().min(1).max(280),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const authorId = ctx.currentUser.id;

    const post = await ctx.db.post.create({
      data: {
        authorId,
        content: input.content,
      },
    });

    return post;
  });
