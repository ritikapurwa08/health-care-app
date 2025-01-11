"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShowPatientDetails from "./show-patients-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import RemovePatientDialog from "./remove-patient";
import UpdatePatientDialog from "./update-patient-dialog";
import AppointmentModalNew from "@/_features/appointment/components/appointment-modal-new";

type UserPatientListCardProps = {
  userId: Id<"users">;
  patientId: Id<"patients">;
  name: string;
  createdAt: number;
};

const UserPatientListCard = ({
  createdAt,
  name,
  patientId,
  userId,
}: UserPatientListCardProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        {format(new Date(createdAt), "dd-MM-yyyy hh:mm:ss")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col bg-dark-400">
            {/* Do not use asChild here */}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ShowPatientDetails PatientId={patientId} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <RemovePatientDialog patientId={patientId} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdatePatientDialog userId={userId} patientId={patientId} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="flex justify-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col bg-dark-400">
            {/* Do not use asChild here */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              typeof="button"
            >
              <AppointmentModalNew
                userId={userId}
                patientId={patientId}
                type="create"
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AppointmentModalNew
                userId={userId}
                patientId={patientId}
                type="update"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const UserPatients = ({ userId }: { userId: Id<"users"> }) => {
  const patients = useQuery(api.patients.getUsersAllCreatedPatient, { userId });

  // Handle different states
  if (patients === undefined) {
    return <div>Loading...</div>;
  }

  if (patients === null) {
    return <div>User not found</div>;
  }

  if (patients.length === 0) {
    return <div>No patients found for this user</div>;
  }

  return (
    <Table>
      <TableCaption>Your Created Patients List.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead className="text-center">Appointment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <UserPatientListCard
            key={patient._id}
            name={patient.name}
            createdAt={patient._creationTime}
            patientId={patient._id}
            userId={userId}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserPatients;
