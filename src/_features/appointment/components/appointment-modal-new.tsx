import React, { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
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

type AppointmentModalNewProps = {
  userId: Id<"users">;
  patientId: Id<"patients">;
  type: "create" | "update" | "schedule" | "remove";
  appointmentId?: Id<"appointments">;
};

const AppointmentModalNew = ({
  patientId,
  type,
  userId,
  appointmentId,
}: AppointmentModalNewProps) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { mutate: create, isPending: creating } = CreateAppointmentHook();
  const { mutate: update, isPending: updating } = UpdateAppointmentHook();
  const { mutate: remove, isPending: removing } = RemoveAppointmentHook();
  const { mutate: schedule, isPending: scheduling } = ScheduleAppointmentHook();
  const { mutate: cancel, isPending: cancelling } = CancelAppointmentHook();

  const { form } = UseAppointmentZodForm();

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
            setOpen(false); // Close the dialog
          },
          onError: (error) => {
            toast({
              title: "Appointment Created",
              description: `${error.message} The appointment has been successfully created.`,
              variant: "default",
            });
            setError(error.message);
          },
        }
      );
    } else if (type === "update" && appointmentId) {
      update(
        {
          appointmentId,
          ...formValues,
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
            setError(error.message);
          },
        }
      );
    } else if (type === "schedule" && appointmentId) {
      schedule(
        {
          appointmentId,
          ...formValues,
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
            type === "remove" && "bg-red-500"
          )}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-300 text-light-200 remove-scrollbar overflow-y-auto max-h-[80vh]">
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

            {type !== "remove" && (
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

                <div
                  className={`flex flex-col gap-6  ${
                    type === "create" && "xl:flex-row"
                  }`}
                >
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
                    disabled={type === "schedule"}
                  />
                </div>
              </>
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
                type === "remove" && "bg-red-500"
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
