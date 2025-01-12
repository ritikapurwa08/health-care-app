"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { StatusBadge } from "./status-badge";
import { Doctors } from "@/_features/register/types";
import AppointmentModalNew from "@/_features/appointment/components/appointment-modal-new";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { formatDateTime } from "@/lib/utils";

type Appointment = Doc<"appointments"> & {
  name?: string[];
};

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;

      const date = formatDateTime(appointment.schedule).dateTime;

      return <p className="text-14-regular min-w-[100px]">{date}</p>;
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          {doctor?.image && (
            <Image
              src={doctor.image}
              alt="doctor"
              width={100}
              height={100}
              className="size-8"
            />
          )}
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-dark-400 text-light-200 "
              side="left"
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AppointmentModalNew
                  patientId={appointment.patientId}
                  userId={appointment.userId}
                  appointment={appointment}
                  appointmentId={appointment._id}
                  type="schedule"
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AppointmentModalNew
                  patientId={appointment.patientId}
                  userId={appointment.userId}
                  appointment={appointment}
                  appointmentId={appointment._id}
                  type="update"
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AppointmentModalNew
                  patientId={appointment.patientId}
                  userId={appointment.userId}
                  appointment={appointment}
                  appointmentId={appointment._id}
                  type="cancel"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
