import React, { useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  CancelAppointmentHook,
  CreateAppointmentHook,
  RemoveAppointmentHook,
  ScheduleAppointmentHook,
  UpdateAppointmentHook,
} from "../hooks/appointment-interaction";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Appointment, UseAppointmentZodForm } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SubmitButton from "@/_features/form/submit-button";
import CustomTextarea from "@/_features/form/custom-textarea";
import CustomDatePicker from "@/_features/form/custom-date-picker";
import CustomSelect from "@/_features/form/custom-select";
import { Doctors } from "@/_features/register/types";
import { Form } from "@/components/ui/form";
import RequestSuccess from "./success-appointment-window";

type AppointmentDoc = Doc<"appointments">;

type AppointmentModalNewProps = {
  userId: Id<"users">;
  patientId: Id<"patients">;
  type: "create" | "update" | "schedule" | "remove" | "cancel";
  appointmentId?: Id<"appointments">;
  appointment?: AppointmentDoc;
};

const AppointmentModalNew = ({
  patientId,
  type,
  userId,
  appointmentId,
  appointment,
}: AppointmentModalNewProps) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { mutate: create, isPending: creating } = CreateAppointmentHook();
  const { mutate: update, isPending: updating } = UpdateAppointmentHook();
  const { mutate: remove, isPending: removing } = RemoveAppointmentHook();
  const { mutate: schedule, isPending: scheduling } = ScheduleAppointmentHook();
  const { mutate: cancel, isPending: cancelling } = CancelAppointmentHook();

  const { form } = UseAppointmentZodForm({ open, appointmentId });

  const onSubmitHandle = (formValues: Appointment) => {
    if (type === "create") {
      create(
        {
          primaryPhysician: formValues.primaryPhysician,
          schedule: formValues.schedule,
          reason: formValues.reason,
          note: formValues.note,
          patientId,
          userId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Appointment Created",
              description: "The appointment has been successfully created.",
              variant: "default",
            });
            setInterval(() => {
              return (
                <div>
                  {appointment && <RequestSuccess appointments={appointment} />}
                </div>
              );
            }, 3000);
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to create appointment: ${error.message}`,
              variant: "destructive",
            });
            setError(error.message);
          },
        }
      );
    } else if (type === "update" && appointmentId) {
      update(
        {
          appointmentId,
          primaryPhysician: formValues.primaryPhysician,
          schedule: formValues.schedule,
          reason: formValues.reason,
          note: formValues.note,
        },
        {
          onSuccess: () => {
            toast({
              title: "Appointment Updated",
              description: "The appointment has been successfully updated.",
              variant: "default",
            });
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to update appointment: ${error.message}`,
              variant: "destructive",
            });
            setError(error.message);
          },
        }
      );
    } else if (type === "schedule" && appointmentId) {
      schedule(
        {
          appointmentId,
          schedule: formValues.schedule,
          primaryPhysician: formValues.primaryPhysician,
        },
        {
          onSuccess: () => {
            toast({
              title: "Appointment Scheduled",
              description: "The appointment has been successfully scheduled.",
              variant: "default",
            });
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to schedule appointment: ${error.message}`,
              variant: "destructive",
            });
            setError(error.message);
          },
        }
      );
    } else if (type === "remove" && appointmentId) {
      remove(
        { appointmentId },
        {
          onSuccess: () => {
            toast({
              title: "Appointment Removed",
              description: "The appointment has been successfully removed.",
              variant: "default",
            });
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to remove appointment: ${error.message}`,
              variant: "destructive",
            });
            setError(error.message);
          },
        }
      );
    } else if (type === "cancel" && appointmentId) {
      cancel(
        {
          appointmentId,
          cancellationReason: formValues.cancellationReason,
        },
        {
          onSuccess: () => {
            toast({
              title: "Appointment Canceled",
              description: "The appointment has been successfully canceled.",
              variant: "default",
            });
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to cancel appointment: ${error.message}`,
              variant: "destructive",
            });
            setError(error.message);
          },
        }
      );
    }
  };

  const buttonLabel = {
    create: "Create Appointment",
    update: "Update Appointment",
    schedule: "Schedule Appointment",
    remove: "Remove Appointment",
    cancel: "Cancel Appointment",
  }[type];

  const FinalLoading =
    creating || updating || removing || scheduling || cancelling;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "",
            type === "create" && "bg-yellow-400",
            type === "update" && "bg-green-500",
            type === "schedule" && "bg-green-500",
            type === "remove" && "bg-red-500",
            type === "cancel" && "bg-red-500"
          )}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-300 text-light-200 remove-scrollbar overflow-y-auto min-h-[80vh] max-h-[80vh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandle)}
            className="flex-1 space-y-6"
          >
            {type === "create" && (
              <section className="mb-12 space-y-4">
                <h1 className="header">New Appointment</h1>
                <p className="text-dark-700">
                  Request a new appointment in 10 seconds.
                </p>
              </section>
            )}

            {/* Show fields based on the type */}
            {type !== "remove" && type !== "cancel" && (
              <>
                <CustomSelect
                  options={Doctors}
                  control={form.control}
                  name="primaryPhysician"
                  label="Primary care physician"
                  placeholder="Select a physician"
                />

                <CustomDatePicker
                  control={form.control}
                  name="schedule"
                  label="Expected appointment date"
                  showTimeSelect
                  dateFormat="MM/dd/yyyy  -  h:mm aa"
                />

                {type !== "schedule" && (
                  <>
                    <CustomTextarea
                      control={form.control}
                      name="reason"
                      label="Appointment reason"
                      placeholder="Annual monthly check-up"
                    />

                    <CustomTextarea
                      control={form.control}
                      name="note"
                      label="Comments/notes"
                      placeholder="Prefer afternoon appointments, if possible"
                    />
                  </>
                )}
              </>
            )}

            {type === "cancel" && (
              <CustomTextarea
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Provide a reason for cancellation"
              />
            )}

            {type === "remove" && (
              <div>
                <p className="text-sm text-gray-600">
                  Are you sure you want to remove this appointment? This action
                  cannot be undone.
                </p>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            )}

            <SubmitButton
              isLoading={FinalLoading}
              className={cn(
                "mt-4 w-full",
                type === "create" && "bg-yellow-400 text-dark-300",
                type === "update" && "bg-green-500",
                type === "schedule" && "bg-green-500",
                type === "remove" && "bg-red-500",
                type === "cancel" && "bg-red-500"
              )}
            >
              {buttonLabel}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModalNew;
