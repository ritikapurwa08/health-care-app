import { z } from "zod";
import { useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UseUserSignInForm } from "../types";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useConvexAuth } from "convex/react";
import { UseGetCurrentUserHook } from "../hooks/user-query-hooks";
import CustomInput from "@/_features/form/custom-input";
import CustomPasswordInput from "@/_features/form/custom-password-input";
import SubmitButton from "@/_features/form/submit-button";

const UserSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useConvexAuth();
  const { user } = UseGetCurrentUserHook();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { form, SignInZodSchema } = UseUserSignInForm();
  type ZodFormValuesSignInType = z.infer<typeof SignInZodSchema>;
  // Handle Sign In
  const handleSignIn = async (formValues: ZodFormValuesSignInType) => {
    setIsLoading(true);
    setError("");

    try {
      await signIn("password", {
        email: formValues.email,
        password: formValues.password,
        flow: "signIn",
      });

      toast({
        title: "Sign In Successful",
        description: "You have been signed in.",
      });
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/patients/register`);
    }
  }, [isAuthenticated, user, router]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            className=""
          />
          <CustomPasswordInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="********"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>
        <div className="flex flex-row justify-start items-center">
          <Checkbox onClick={handleShowPassword} className="" />
          <span className="ml-2 text-dark-700 text-xs">Show Password</span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
      </form>
    </Form>
  );
};

export default UserSignIn;
