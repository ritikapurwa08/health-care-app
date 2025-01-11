// components/custom-email-input.tsx
"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { IconType } from "react-icons";
import { useDebounce } from "use-debounce";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { UseCheckEmailHook } from "@/_features/auth/hooks/user-query-hooks";
import { Input } from "@/components/ui/input";

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  iconSrc?: string | StaticImageData;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  setIsEmailAvailable: (isAvailable: boolean) => void; // New prop
}

export default function CustomEmailInput<T extends FieldValues>({
  name,
  className,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  defaultValue,
  iconSrc,
  setIsEmailAvailable, // Destructure the new prop
}: Readonly<CustomEmailInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  const [email, setEmail] = useState(field.value || "");
  const [debouncedEmail] = useDebounce(email, 100); // Debounce for 500ms

  const { checkEmail, isLoading } = UseCheckEmailHook({
    email: debouncedEmail,
  });

  useEffect(() => {
    setEmail(field.value || "");
  }, [field.value]);

  useEffect(() => {
    if (debouncedEmail && checkEmail !== undefined) {
      setIsEmailAvailable(!checkEmail); // Update the email availability state in the parent component
    }
  }, [checkEmail, debouncedEmail, setIsEmailAvailable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    field.onChange(value); // Update form value
  };

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <FormLabel
        htmlFor={`${name}-input`}
        className="text-sm -mb-2 text-light-200"
      >
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {iconSrc && (
            <div className="absolute top-1/2 transform -translate-y-1/2 ">
              <Image
                src={iconSrc}
                height={24}
                width={24}
                alt={"icon"}
                className="ml-2"
              />
            </div>
          )}

          <Input
            id={`${name}-input`}
            placeholder={placeholder}
            value={email}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "pr-10 shad-input",
              !!Icon || (!!iconSrc && "pl-10"),
              className
            )}
          />

          {/* Loading and Validation Icons */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : debouncedEmail && checkEmail !== undefined ? (
              checkEmail ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            ) : null}
          </div>
        </div>
      </FormControl>

      <FormMessage className="mt-1 text-xs font-normal text-red-400">
        {fieldError?.message && <span>{fieldError.message}</span>}
        {debouncedEmail && checkEmail && (
          <span>This email is already registered.</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
