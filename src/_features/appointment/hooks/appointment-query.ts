import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

export const GetAppointmentsByPatientId = ({
  patientId,
}: {
  patientId: Id<"patients">;
}) => {
  const appointments = useQuery(api.appointments.getAppointmentsByPatientId, {
    patientId,
  });

  return {
    appointments,
  };
};

export const GetAppointmentsByUserId = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const appointments = useQuery(api.appointments.getAppointmentsByUserId, {
    userId,
  });
  return {
    appointments,
  };
};
