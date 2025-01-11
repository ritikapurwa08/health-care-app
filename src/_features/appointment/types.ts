import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export const UseAppointmentZodForm = () => {
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

  return {
    form,
  };
};
