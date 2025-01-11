"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { UseGetCurrentUserHook } from "../hooks/user-query-hooks";

const UserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { signOut } = useAuthActions();

  // Fetch current user
  const { user, isLoading: isUserLoading } = UseGetCurrentUserHook();

  // Handle sign-out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
      router.push("/"); // Redirect to login page
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the first character of the user's name or email
  const getFirstCharacter = () => {
    if (!user) return "U"; // Default fallback
    const name = user.name || user.email || "User";
    return name.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
          disabled={isUserLoading}
        >
          {isUserLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage alt={user?.name} />
              <AvatarFallback>{getFirstCharacter()}</AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage alt={user?.name} />
            <AvatarFallback>{getFirstCharacter()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <div className="flex flex-row justify-center items-center">
              <LogOutIcon className="size-3.5 mr-2" />
              <span className="text-xs">Sign out</span>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
