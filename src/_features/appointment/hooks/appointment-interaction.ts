import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useMutationHook } from "@/_features/register/hooks/register-interaction-hooks";

export const CreateAppointmentHook = () => {
  const createAppointmentMutation = useMutation(
    api.appointments.createAppointment
  );
  return useMutationHook(createAppointmentMutation);
};
export const UpdateAppointmentHook = () => {
  const updateAppointmentMutation = useMutation(
    api.appointments.updateAppointment
  );
  return useMutationHook(updateAppointmentMutation);
};

export const RemoveAppointmentHook = () => {
  const removeAppointmentMutation = useMutation(
    api.appointments.removeAppointment
  );
  return useMutationHook(removeAppointmentMutation);
};

export const ScheduleAppointmentHook = () => {
  const scheduleAppointmentMutation = useMutation(
    api.appointments.scheduleAppointment
  );
  return useMutationHook(scheduleAppointmentMutation);
};

export const CancelAppointmentHook = () => {
  const cancelAppointmentMutation = useMutation(
    api.appointments.cancelAppointment
  );
  return useMutationHook(cancelAppointmentMutation);
};
