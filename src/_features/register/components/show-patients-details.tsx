"use client";

import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Replace with your dialog component
import { Button } from "@/components/ui/button"; // Replace with your button component
import { Skeleton } from "@/components/ui/skeleton"; // Replace with your skeleton component

type ShowPatientDetailsProps = {
  PatientId: Id<"patients">;
};

const ShowPatientDetails = ({ PatientId }: ShowPatientDetailsProps) => {
  const patient = useQuery(api.patients.getPatientById, {
    patientId: PatientId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">show details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[80vh] bg-dark-400 text-light-200 remove-scrollbar">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {patient === undefined && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {/* Null/Undefined State */}
        {patient === null && (
          <div className="text-center text-gray-500">
            No patient details found.
          </div>
        )}

        {/* Patient Details */}
        {patient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{patient.birthDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="font-medium">{patient.emergencyContactName}</p>
                <p className="text-sm text-gray-500">
                  {patient.emergencyContactNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance Provider</p>
                <p className="font-medium">{patient.insuranceProvider}</p>
                <p className="text-sm text-gray-500">
                  Policy: {patient.insurancePolicyNumber}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <p className="font-medium">{patient.allergies || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Current Medication</p>
              <p className="font-medium">
                {patient.currentMedication || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Family Medical History</p>
              <p className="font-medium">
                {patient.familyMedicalHistory || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Past Medical History</p>
              <p className="font-medium">
                {patient.pastMedicalHistory || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Identification</p>
              <p className="font-medium">
                {patient.identificationType}: {patient.identificationNumber}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowPatientDetails;
