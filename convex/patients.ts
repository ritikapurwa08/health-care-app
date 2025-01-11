import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPatient = mutation({
  args: {
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
    treatmentConsent: v.boolean(),
    disclosureConsent: v.boolean(),
    privacyConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a patient");
    }

    const patient = await ctx.db.insert("patients", {
      ...args,
    });

    return patient;
  },
});
export const updatePatient = mutation({
  args: {
    userId: v.id("users"),
    patientId: v.id("patients"),
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
    treatmentConsent: v.boolean(),
    disclosureConsent: v.boolean(),
    privacyConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a patient");
    }
    const { patientId, ...updateData } = args;

    const patient = await ctx.db.patch(patientId, {
      ...updateData,
    });

    return patient;
  },
});

export const getUsersFirstPatient = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    const patients = await ctx.db
      .query("patients")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return patients;
  },
});

export const getUsersAllCreatedPatient = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    const usersAllPatient = await ctx.db
      .query("patients")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return usersAllPatient;
  },
});

export const getPatientById = query({
  args: {
    patientId: v.optional(v.id("patients")),
  },
  handler: async (ctx, args) => {
    if (!args.patientId) {
      return null; // or undefined, depending on your preference
    }
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      return null;
    }
    return patient;
  },
});

export const removePatient = mutation({
  args: {
    patientId: v.id("patients"),
  },
  handler: async (ctx, args) => {
    const patient = await ctx.db.delete(args.patientId);

    return patient;
  },
});
