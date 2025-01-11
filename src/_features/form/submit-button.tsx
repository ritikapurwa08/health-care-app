import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const SubmitButton = ({
  isLoading,
  className,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={className ?? "shad-primary-btn  w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
