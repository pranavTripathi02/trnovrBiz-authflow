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
          router.replace("/");
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
      </p>
      <div className="my-4 mb-12">
        <h2 className="my-2 text-left">Code</h2>
        <OTPInput
          containerStyle={"flex justify-between"}
          value={otp}
          onChange={setOtp}
          numInputs={8}
          renderInput={(props) => <input {...props} />}
          inputType="tel"
          inputStyle={"border min-w-12 h-12 rounded-md"}
        />
      </div>
      <button
        className="w-full rounded-md bg-black py-4 text-center font-medium uppercase text-white"
        onClick={handleVerify}
      >
        VERIFY
      </button>
    </div>
  );
}

export default VerifyMail;
