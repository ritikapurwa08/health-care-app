import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Baby,
  Car,
  HeartPulse,
  Shield,
  CreditCard,
  BookIcon,
  Landmark,
  Fingerprint,
  School,
  Vote,
} from "lucide-react";
import { SelectOption } from "../form/custom-select";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const PatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.string(), // or z.date() if you prefer
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name must be at least 2 characters"),
  emergencyContactNumber: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  primaryPhysician: z
    .string()
    .min(2, "Primary physician must be at least 2 characters"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance provider must be at least 2 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Insurance policy number must be at least 2 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.array(z.string()).optional(), // Assuming file IDs are stored as strings
  treatmentConsent: z
    .boolean()
    .refine((val) => val === true, "You must consent to treatment"),
  disclosureConsent: z
    .boolean()
    .refine((val) => val === true, "You must consent to disclosure"),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, "You must consent to privacy"),
});

export type Patient = z.infer<typeof PatientSchema>;

type UsePatientZodFormProps = {
  patientId?: Id<"patients">;
  open?: boolean;
};

export const UsePatientZodForm = ({
  open,
  patientId,
}: UsePatientZodFormProps) => {
  const existingPatient = useQuery(
    api.patients.getPatientById,
    patientId ? { patientId } : "skip" // Skip the query if patientId is undefined
  );

  const form = useForm<Patient>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "Male",
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      identificationType: "",
      identificationNumber: "",
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
    },
  });

  useEffect(() => {
    if (existingPatient && open) {
      form.reset({
        name: existingPatient.name,
        email: existingPatient.email,
        phone: existingPatient.phone,
        birthDate: existingPatient.birthDate,
        gender: existingPatient.gender,
        address: existingPatient.address,
        occupation: existingPatient.occupation,
        emergencyContactName: existingPatient.emergencyContactName,
        emergencyContactNumber: existingPatient.emergencyContactNumber,
        primaryPhysician: existingPatient.primaryPhysician,
        insuranceProvider: existingPatient.insuranceProvider,
        insurancePolicyNumber: existingPatient.insurancePolicyNumber,
        allergies: existingPatient.allergies,
        currentMedication: existingPatient.currentMedication,
        familyMedicalHistory: existingPatient.familyMedicalHistory,
        pastMedicalHistory: existingPatient.pastMedicalHistory,
        identificationType: existingPatient.identificationType,
        identificationNumber: existingPatient.identificationNumber,
        treatmentConsent: existingPatient.treatmentConsent,
        disclosureConsent: existingPatient.disclosureConsent,
        privacyConsent: existingPatient.privacyConsent,
      });
    }
  }, [existingPatient, open, form]);

  return {
    form,
  };
};

export const GenderOptions = ["Male", "Female", "Other"];

export const IdentificationTypes: SelectOption[] = [
  {
    icon: Baby,
    name: "Birth Certificate",
  },
  {
    icon: Car,
    name: "Driver's License",
  },
  {
    icon: HeartPulse,
    name: "Medical Insurance Card/Policy",
  },
  {
    icon: Shield,
    name: "Military ID Card",
  },
  {
    icon: CreditCard,
    name: "National Identity Card",
  },
  {
    icon: BookIcon,
    name: "Passport",
  },
  {
    icon: Landmark,
    name: "Resident Alien Card (Green Card)",
  },
  {
    icon: Fingerprint,
    name: "Social Security Card",
  },
  {
    icon: CreditCard,
    name: "State ID Card",
  },
  {
    icon: School,
    name: "Student ID Card",
  },
  {
    icon: Vote,
    name: "Voter ID Card",
  },
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
