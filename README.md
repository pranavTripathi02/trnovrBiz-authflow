# Next.js Auth Flow
Created using T3 Stack

## Features
- Next.js as web framework.
- tRPC for backend APIs.
- Nodemailer for sending email verification code.
- Fakerjs for dummy data.
- Neon for PostgreSQL db.
- Prisma as db ORM.
- TailwindCSS for styling.
- Custom auth.

### How to use the application
- Register yourself using your name, email and password.
- Verify your email handle using the 8 digit verification code sent to your inbox. (check spam) (or use 12345678)
- Login to the application after verifying your email address.
- Start selecting your choices! (application might be a little slow due to Neon constraints)

- Your session will be preserved using a JWT cookie which will automatically expire in 15 mins.
- Your choices will be preserved on the database.

#### Run locally
- git clone the repo
- add your environment variables (see .env.example)
- `npm install && npm run dev`
