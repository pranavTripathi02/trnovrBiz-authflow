"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OTPInput from "react-otp-input";

function VerifyMail({
  userId,
  userMail,
}: {
  userId: number;
  userMail: string;
}) {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const mutation = api.user.verifyUser.useMutation();

  const handleVerify = async () => {
    await mutation.mutateAsync(
      { userId, verificationToken: otp },
      {
        onSuccess: () => {
          setTimeout(() => router.replace("/"), 2000);
        },
      },
    );
  };
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Verify your email</h1>
      <p className="mb-8">
        Enter the 8 digit code you have received on {userMail[0]}
        {userMail[1] && userMail[1]}***
        {userMail.substring(userMail.indexOf("@"))}
        <span className="my-0 block text-sm opacity-80">
          (Don&apos;t forget to check your spam folder)
        </span>
      </p>
      <div className="mb-2 mt-4">
        <form>
          <span className="my-2 block w-fit text-left">Code</span>
          <OTPInput
            containerStyle={"flex justify-between"}
            value={otp}
            onChange={setOtp}
            numInputs={8}
            renderInput={(props) => <input {...props} />}
            inputType="tel"
            inputStyle={"border min-w-12 h-12 rounded-md"}
          />
          <p className="my-2 text-xs opacity-40">(use 12345678)</p>
          {mutation.isError && (
            <p className="my-4 text-center text-red-600">
              {mutation.error.message}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="my-4 text-center text-green-800">
              Verified! Please login.
            </p>
          )}
          <button
            type="submit"
            className={`mt-9 w-full rounded-md py-4 text-center font-medium uppercase ${mutation.isPending ? "cursor-progress bg-neutral-300 text-black" : "bg-black text-white"}`}
            onClick={(e) => {
              e.preventDefault();
              void handleVerify();
            }}
          >
            VERIFY
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyMail;
