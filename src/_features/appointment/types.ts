import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.string(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});
export type Appointment = z.infer<typeof CreateAppointmentSchema>;

type UseAppointmentZodFormProps = {
  open?: boolean;
  appointmentId?: Id<"appointments">;
};

export const UseAppointmentZodForm = ({
  appointmentId,
  open,
}: UseAppointmentZodFormProps) => {
  const form = useForm<Appointment>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      primaryPhysician: "",
      schedule: "",
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  const existingAppoint = useQuery(
    api.appointments.getAppointmentById,
    appointmentId ? { appointmentId } : "skip"
  );

  useEffect(() => {
    if (existingAppoint && open) {
      form.reset({
        schedule: existingAppoint.schedule,
        primaryPhysician: existingAppoint.primaryPhysician,
        reason: existingAppoint.reason,
        note: existingAppoint.note,
        cancellationReason: existingAppoint.cancellationReason,
      });
    }
  }, [existingAppoint, form, open]);

  return {
    form,
  };
};
