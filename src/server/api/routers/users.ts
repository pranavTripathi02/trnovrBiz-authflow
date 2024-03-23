import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { transporter, mailOptions } from "@/lib/nodemailer";
import jwt from "jsonwebtoken";
import { env } from "@/env";

const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      const userExists = await ctx.db.user.findFirst({ where: { email } });
      if (userExists && !userExists.isVerified) {
        const userVerificationToken = "75258437";
        await transporter.sendMail({
          ...mailOptions,
          to: userExists.email,
          subject: "Verify your account",
          text: `Hi ${name}, your verification token is: ${userVerificationToken}`,
          html: `
            <h1>Hi, ${name}</h1>
            Use this 8 digit code as your verification token <b>${userVerificationToken}</b>`,
        });
        return {
          userId: userExists.id,
          message:
            "User Already Exists. Verify the 8 digit code sent to your email inbox.",
          status: 200,
        };
      }
      if (userExists) {
        throw new TRPCError({
          message: "User with this email already exists",
          code: "BAD_REQUEST",
        });
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const createdUser = await ctx.db.user.create({
          data: {
            email,
            name,
            password: passwordHash,
          },
        });

        // gen verification token
        const userVerificationToken = "12345678";
        await ctx.db.verificationToken.create({
          data: {
            token: userVerificationToken,
            userId: createdUser.id,
          },
        });
        await transporter.sendMail({
          ...mailOptions,
          to: createdUser.email,
          subject: "Verify your account",
          text: `Hi ${name}, your verification token is: ${userVerificationToken}`,
          html: `
            <h1>Hi, ${name}</h1>
            Use this 8 digit code as your verification token <b>${userVerificationToken}</b>`,
        });
        return {
          userId: createdUser.id,
          message:
            "User Created. Verify the 8 digit code sent to your email inbox.",
          status: 200,
        };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          message: "Please try again",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  verifyUser: publicProcedure
    .input(z.object({ userId: z.number(), verificationToken: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, verificationToken } = input;
      const foundIdx = await ctx.db.verificationToken.findUnique({
        where: {
          userId,
          token: verificationToken,
        },
      });
      if (!foundIdx) {
        throw new TRPCError({
          message: "Invalid credentials",
          code: "UNAUTHORIZED",
        });
      }
      await ctx.db.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const userFound = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });
      if (!userFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found with this email",
        });
      }
      if (!userFound.isVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please verify your email by registering again.",
        });
      }
      const passCompare = await bcrypt.compare(password, userFound.password);
      if (!passCompare) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Password does not match.",
        });
      }
      const jwtUser = {
        id: userFound.id,
        name: userFound.name,
      };
      const accessTokenJWT = jwt.sign(jwtUser, env.JWT_SECRET, {
        expiresIn: "15m",
      });
      // console.log("signed", accessTokenJWT);
      return {
        message: "You are now logged in",
        user: jwtUser,
        accessToken: accessTokenJWT,
      };
    }),
  getUserSession: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.userId;
    if (!userId) {
      console.log("no user id");
    }
    const userFound = await ctx.db.user.findFirst({
      where: { id: userId, isVerified: true },
      select: {
        id: true,
        name: true,
        categories: true,
      },
    });
    if (!userFound) {
      throw new TRPCError({
        message: "Invalid session cookie. Please log in again.",
        code: "UNAUTHORIZED",
      });
    }
    return { user: userFound };
  }),
  getUserCategories: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.userId;
    const userCategories = await ctx.db.user.findFirst({
      where: { id: userId },
      select: {
        categories: {
          select: {
            categoryId: true,
          },
        },
      },
    });
    if (!userCategories?.categories) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    return userCategories.categories;
  }),
});

export default userRouter;
