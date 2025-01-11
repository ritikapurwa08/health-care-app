"use client";

import React, { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { UseRemovePatientHook } from "../hooks/register-interaction-hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react"; // For loading spinner

type RemovePatientProps = {
  patientId: Id<"patients">;
};

const RemovePatientDialog = ({ patientId }: RemovePatientProps) => {
  const { mutate: remove, isPending: removing } = UseRemovePatientHook();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleRemovePatient = () => {
    remove(
      { patientId },
      {
        onSuccess: () => {
          // Show success toast
          toast({
            title: "Patient Removed",
            description: "The patient has been successfully removed.",
            variant: "default",
          });
          setOpen(false); // Close the dialog
        },
        onError: (error) => {
          // Show error toast
          toast({
            title: "Error",
            description: error.message || "Failed to remove the patient.",
            variant: "destructive",
          });
          setError(error.message);
        },
        onSettled: () => {
          setError(""); // Clear any previous errors
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="destructive">Remove Patient</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Patient</DialogTitle>
        </DialogHeader>

        {/* Confirmation Message */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove this patient? This action cannot be
            undone.
          </p>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={removing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemovePatient}
              disabled={removing}
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemovePatientDialog;
