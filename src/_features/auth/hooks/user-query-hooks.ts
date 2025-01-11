import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const UseGetCurrentUserHook = () => {
  const user = useQuery(api.users.getCurrentUser);
  const isLoading = user === undefined;
  return { user, isLoading };
};

export const UseCheckEmailHook = ({ email }: { email: string }) => {
  const checkEmail = useQuery(api.users.checkEmail, { email });
  const isLoading = checkEmail === undefined;
  return { checkEmail, isLoading };
};
