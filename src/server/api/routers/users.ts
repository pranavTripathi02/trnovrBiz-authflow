import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { transporter, mailOptions } from "@/lib/nodemailer";

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
          subject: "Verify your account",
          text: `Hi ${name}, your verification token is: ${userVerificationToken}`,
          html: `
            <h1>Hi, ${name}</h1>
            Use this 8 digit code as your verification token <b>${userVerificationToken}</b>`,
        });
        return {
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
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      try {
        const userFound = await ctx.db.user.findUnique({
          where: {
            email,
            // isVerified: true,
          },
        });
        if (!userFound) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No user found with this email",
          });
        }
        const passCompare = await bcrypt.compare(password, userFound.password);
        if (!passCompare) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Password does not match.",
          });
        }
        const sessionCreated = await ctx.db.session.create({
          data: { userId: userFound.id },
        });
        cookies().set("session-cookie", sessionCreated.id, {
          expires: 15 * 60 * 1000,
          httpOnly: true,
        });
        // update lastlogin
        // await ctx.db.user.update({
        //   where: { email },
        //   data: { lastLogin: Date() },
        // });
        return {
          message: "You are now logged in",
          user: {
            name: userFound.name,
            email: userFound.email,
          },
        };
      } catch (err) {
        throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

export default userRouter;
