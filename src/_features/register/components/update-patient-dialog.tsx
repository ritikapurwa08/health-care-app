"use client";

import React, { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UseUpdatePatientHook } from "../hooks/register-interaction-hooks";
import {
  Doctors,
  IdentificationTypes,
  Patient,
  UsePatientZodForm,
} from "../types";
import SubmitButton from "@/_features/form/submit-button";
import CustomCheckbox from "@/_features/form/custom-checkbox";
import CustomInput from "@/_features/form/custom-input";
import CustomSelect from "@/_features/form/custom-select";
import CustomTextarea from "@/_features/form/custom-textarea";
import CustomPhoneInput from "@/_features/form/custom-phone-input";
import CustomRadioGroup from "@/_features/form/custom-radio-group";
import CustomDatePicker from "@/_features/form/custom-date-picker";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type UpdatePatientDialogProps = {
  patientId: Id<"patients">;
  userId: Id<"users">;
};

const UpdatePatientDialog = ({
  patientId,
  userId,
}: UpdatePatientDialogProps) => {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { mutate: update, isPending: updating } = UseUpdatePatientHook();
  const { form } = UsePatientZodForm({ patientId, open });

  // Pre-fill the form with existing patient data

  const handleUpdatePatient = (formValues: Patient) => {
    update(
      {
        patientId: patientId,
        userId: userId,
        ...formValues,
      },
      {
        onSuccess: () => {
          toast({
            title: "Patient Updated",
            description: "The patient has been successfully updated.",
            variant: "default",
          });
          setOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update the patient.",
            variant: "destructive",
          });
          setError(error.message);
        },
        onSettled: () => {
          setError("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Patient</Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-auto bg-dark-300 remove-scrollbar max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Update Patient</DialogTitle>
          <DialogDescription>
            Update the patients details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(handleUpdatePatient)}>
            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
              </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              {/* NAME */}
              <CustomInput
                control={form.control}
                name="name"
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                label="Name"
              />

              {/* EMAIL & PHONE */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email address"
                  placeholder="johndoe@gmail.com"
                  iconSrc="/assets/icons/email.svg"
                />

                <CustomPhoneInput
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* BirthDate & Gender */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomDatePicker
                  control={form.control}
                  name="birthDate"
                  showTimeSelect={true}
                  placeholder="Select a date "
                  label="Date of birth"
                />
                <CustomRadioGroup
                  control={form.control}
                  name="gender"
                  label="Gender"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              </div>

              {/* Address & Occupation */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomInput
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="14 street, New york, NY - 5101"
                />

                <CustomInput
                  control={form.control}
                  name="occupation"
                  label="Occupation"
                  placeholder="Software Engineer"
                />
              </div>

              {/* Emergency Contact Name & Emergency Contact Number */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomInput
                  control={form.control}
                  name="emergencyContactName"
                  label="Emergency contact name"
                  placeholder="Guardian's name"
                />

                <CustomPhoneInput
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Emergency contact number"
                  placeholder="(555) 123-4567"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
              </div>

              {/* PRIMARY CARE PHYSICIAN */}
              <CustomSelect
                options={Doctors}
                control={form.control}
                name="primaryPhysician"
                label="Primary care physician"
                placeholder="Select a physician"
              />

              {/* INSURANCE & POLICY NUMBER */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomInput
                  control={form.control}
                  name="insuranceProvider"
                  label="Insurance provider"
                  placeholder="BlueCross BlueShield"
                />

                <CustomInput
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Insurance policy number"
                  placeholder="ABC123456789"
                />
              </div>

              {/* ALLERGY & CURRENT MEDICATIONS */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomTextarea
                  control={form.control}
                  name="allergies"
                  label="Allergies (if any)"
                  placeholder="Peanuts, Penicillin, Pollen"
                />

                <CustomTextarea
                  control={form.control}
                  name="currentMedication"
                  label="Current medications"
                  placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                />
              </div>

              {/* FAMILY MEDICATION & PAST MEDICATIONS */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomTextarea
                  control={form.control}
                  name="familyMedicalHistory"
                  label="Family medical history (if relevant)"
                  placeholder="Mother had brain cancer, Father has hypertension"
                />

                <CustomTextarea
                  control={form.control}
                  name="pastMedicalHistory"
                  label="Past medical history"
                  placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification and Verification</h2>
              </div>

              <CustomSelect
                options={IdentificationTypes}
                control={form.control}
                name="identificationType"
                label="Identification Type"
                placeholder="Select identification type"
              />

              <CustomInput
                control={form.control}
                name="identificationNumber"
                label="Identification Number"
                placeholder="123456789"
              />
            </section>

            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
              </div>

              <CustomCheckbox
                control={form.control}
                name="treatmentConsent"
                label="I consent to receive treatment for my health condition."
              />

              <CustomCheckbox
                control={form.control}
                name="disclosureConsent"
                label="I consent to the use and disclosure of my health information for treatment purposes."
              />

              <CustomCheckbox
                control={form.control}
                name="privacyConsent"
                label="I acknowledge that I have reviewed and agree to the privacy policy."
              />
            </section>

            <div className="pt-4">
              <SubmitButton isLoading={updating}>Update</SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePatientDialog;
