import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const Schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    role: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_email", ["email"]),

  patients: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    birthDate: v.string(), // or v.number() if you store it as a timestamp
    gender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
    address: v.string(),
    occupation: v.string(),
    emergencyContactName: v.string(),
    emergencyContactNumber: v.string(),
    primaryPhysician: v.string(),
    insuranceProvider: v.string(),
    insurancePolicyNumber: v.string(),
    allergies: v.optional(v.string()),
    currentMedication: v.optional(v.string()),
    familyMedicalHistory: v.optional(v.string()),
    pastMedicalHistory: v.optional(v.string()),
    identificationType: v.optional(v.string()),
    identificationNumber: v.optional(v.string()),
    identificationDocument: v.optional(v.array(v.id("_storage"))), // Assuming file URLs are stored as strings
    treatmentConsent: v.boolean(),
    disclosureConsent: v.boolean(),
    privacyConsent: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_primaryPhysician", ["primaryPhysician"]),

  appointments: defineTable({
    userId: v.id("users"), // ID of the user creating the appointment
    patientId: v.id("patients"), // ID of the patient the appointment is for
    primaryPhysician: v.string(), // Primary physician for the appointment
    schedule: v.string(), // Date and time of the appointment (stored as a string or number)
    reason: v.string(), // Reason for the appointment
    note: v.optional(v.string()), // Optional note
    cancellationReason: v.optional(v.string()), // Optional cancellation reason
    status: v.union(
      v.literal("pending"),
      v.literal("scheduled"),
      v.literal("cancelled")
    ),
  })
    .index("by_userId", ["userId"]) // Index for querying appointments by user ID
    .index("by_patientId", ["patientId"]) // Index for querying appointments by patient ID
    .index("by_schedule", ["schedule"]),
  // Your other tables...
});

export default Schema;
