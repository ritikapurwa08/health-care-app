import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

export const UseGetPatientByUserId = ({ userId }: { userId: Id<"users"> }) => {
  const patient = useQuery(api.patients.getUsersFirstPatient, { userId });

  return { patient };
};

export const UseGetUsersAllPatient = ({ userId }: { userId: Id<"users"> }) => {
  const allpatients = useQuery(api.patients.getUsersAllCreatedPatient, {
    userId,
  });

  return allpatients;
};
