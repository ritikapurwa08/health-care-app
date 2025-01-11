"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { UseZodSignUpForm } from "../types";
import { Form } from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import "react-phone-number-input/style.css";
import { useConvexAuth } from "convex/react";
import { UseGetCurrentUserHook } from "../hooks/user-query-hooks";
import CustomInput from "@/_features/form/custom-input";
import CustomEmailInput from "@/_features/form/custom-email-input";
import CustomPasswordInput from "@/_features/form/custom-password-input";
import CustomPhoneInput from "@/_features/form/custom-phone-input";
import SubmitButton from "@/_features/form/submit-button";

const UserSignUp = () => {
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { form, SignUpZodSchema } = UseZodSignUpForm({ isEmailAvailable });
  const router = useRouter();
  const [error, setError] = useState("");
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { user } = UseGetCurrentUserHook();

  type ZodFormSignUpType = z.infer<typeof SignUpZodSchema>;

  const handleSignUp = (formValues: ZodFormSignUpType) => {
    setLoading(true);
    setError("");

    signIn("password", {
      ...formValues,
      role: "user",
      flow: "signUp",
    })
      .then(() => {
        // No need for setInterval here
      })
      .catch((err) => {
        setError(err.message || "An error occurred during sign-up.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Use useEffect to handle redirection after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/patients/register`);
    }
  }, [isAuthenticated, user, router]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-2">
        <div className="flex flex-row gap-x-2">
          <CustomInput
            control={form.control}
            name="name"
            label="Enter Full Name"
            placeholder="John Due"
            iconSrc="/assets/icons/user.svg"
          />
          <CustomEmailInput
            control={form.control}
            name="email"
            setIsEmailAvailable={setIsEmailAvailable}
            label="Enter Full Name"
            placeholder="John Due"
            iconSrc="/assets/icons/email.svg"
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <CustomPasswordInput
            control={form.control}
            name="password"
            label="Password"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Enter Your Mobile Number"
          />
          <CustomPhoneInput
            control={form.control}
            name="phoneNumber"
            label="Enter Your Mobile Number"
            className="w-full"
            placeholder="555-555-5555"
          />
        </div>

        <div
          onClick={handleShowPassword}
          className="flex flex-row pt-2 justify-start items-center"
        >
          <Checkbox className="" />
          <span className="ml-2 text-xs">
            {showPassword ? "Hide Password" : "Show Password"}
          </span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <SubmitButton
          disabled={!isValid || !isEmailAvailable}
          isLoading={loading}
        >
          Get Started
        </SubmitButton>
      </form>
    </Form>
  );
};

export default UserSignUp;
