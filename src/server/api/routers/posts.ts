import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/backend/dist/types/api/resources/User";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters

import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

// Create a new ratelimiter, that allows 5 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

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
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUser;

      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are doing that too much. Please try again later.",
        });
      }

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content ?? "", // Provide a default value for content
        },
      });

      return post;
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
