import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image, { StaticImageData } from "next/image";

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  iconSrc?: string | StaticImageData;
  defaultValue?: PathValue<T, FieldPath<T>>;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function CustomInput<T extends FieldValues>({
  name,
  className,
  error,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  onChange,
  iconSrc,
  defaultValue,
}: Readonly<CustomInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <FormLabel
        htmlFor={`${name}-input`}
        className="text-sm -mb-2 text-light-200"
      >
        {label}
      </FormLabel>

      <FormControl className="m-0  p-0">
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className={
                "absolute top-1/2   w-10 transform -translate-y-1/2  left-0 text-muted-foreground"
              }
            />
          )}
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
            {...field}
            disabled={disabled}
            className={cn(
              "pr-10  shad-input ",
              !!Icon || (!!iconSrc && "pl-10"),
              className
            )}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />
        </div>
      </FormControl>
      <FormMessage className=" m-0 -mb-4 p-0 text-xs text-red-600">
        {(error ?? fieldError?.message) && (
          <span>{error ?? fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
