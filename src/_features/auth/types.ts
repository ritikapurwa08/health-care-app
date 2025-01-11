import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const UseZodSignUpForm = ({
  isEmailAvailable,
}: {
  isEmailAvailable: boolean;
}) => {
  const SignUpZodSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      phoneNumber: z.string().min(13, "at least 13"),
    })

    .refine(() => isEmailAvailable, {
      message: "This email is already registered.",
      path: ["email"],
    });
  type SignUpFormZodValues = z.infer<typeof SignUpZodSchema>;
  const form = useForm<SignUpFormZodValues>({
    resolver: zodResolver(SignUpZodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  return {
    form,
    SignUpZodSchema,
  };
};

export const UseUserSignInForm = () => {
  const SignInZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  type ZodFormValuesSignInType = z.infer<typeof SignInZodSchema>;
  const form = useForm<ZodFormValuesSignInType>({
    resolver: zodResolver(SignInZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return {
    form,
    SignInZodSchema,
  };
};
