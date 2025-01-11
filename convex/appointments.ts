import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAppointment = mutation({
  args: {
    userId: v.id("users"), // ID of the user creating the appointment
    patientId: v.id("patients"), // ID of the patient
    primaryPhysician: v.string(), // Primary physician
    schedule: v.string(), // Date and time of the appointment
    reason: v.string(), // Reason for the appointment
    note: v.optional(v.string()), // Optional note
  },
  handler: async (ctx, args) => {
    const { userId, patientId, primaryPhysician, schedule, reason, note } =
      args;

    // Insert the appointment into the `appointments` table
    const appointmentId = await ctx.db.insert("appointments", {
      userId,
      patientId,
      primaryPhysician,
      schedule,
      reason,
      note,
      status: "pending", // Default status
      cancellationReason: undefined, // No cancellation reason initially
    });

    return appointmentId;
  },
});

// Update an existing appointment
export const updateAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"), // ID of the appointment to update
    primaryPhysician: v.optional(v.string()), // Optional updated primary physician
    schedule: v.optional(v.string()), // Optional updated schedule
    reason: v.optional(v.string()), // Optional updated reason
    note: v.optional(v.string()), // Optional updated note
  },
  handler: async (ctx, args) => {
    const { appointmentId, ...updates } = args;

    // Update the appointment in the `appointments` table
    await ctx.db.patch(appointmentId, updates);

    return appointmentId;
  },
});

// Schedule an appointment
export const scheduleAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"), // ID of the appointment to schedule
    schedule: v.optional(v.string()), // Optional updated schedule
  },
  handler: async (ctx, args) => {
    const { appointmentId, schedule } = args;

    // Update the appointment status to "scheduled" and optionally update the schedule
    await ctx.db.patch(appointmentId, {
      status: "scheduled",
      schedule: schedule, // Update the schedule if provided
    });

    return appointmentId;
  },
});

// Cancel an appointment
export const cancelAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"), // ID of the appointment to cancel
    cancellationReason: v.optional(v.string()), // Optional cancellation reason
  },
  handler: async (ctx, args) => {
    const { appointmentId, cancellationReason } = args;

    // Update the appointment status to "cancelled" and set the cancellation reason
    await ctx.db.patch(appointmentId, {
      status: "cancelled",
      cancellationReason,
    });

    return appointmentId;
  },
});

// Remove (delete) an appointment
export const removeAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"), // ID of the appointment to remove
  },
  handler: async (ctx, args) => {
    const { appointmentId } = args;

    // Delete the appointment from the `appointments` table
    await ctx.db.delete(appointmentId);

    return appointmentId;
  },
});

export const getAppointmentsByUserId = query({
  args: {
    userId: v.id("users"), // ID of the user
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Fetch appointments for the given user ID
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return appointments;
  },
});

export const getAppointmentsByPatientId = query({
  args: {
    patientId: v.id("patients"), // ID of the patient
  },
  handler: async (ctx, args) => {
    const { patientId } = args;

    // Fetch appointments for the given patient ID
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_patientId", (q) => q.eq("patientId", patientId))
      .first();

    return appointments;
  },
});

export const getAppointmentCounts = query({
  args: {}, // No arguments needed
  handler: async (ctx) => {
    // Fetch all appointments
    const appointments = await ctx.db.query("appointments").collect();

    // Count appointments by status
    const scheduledCount = appointments.filter(
      (appointment) => appointment.status === "scheduled"
    ).length;

    const cancelledCount = appointments.filter(
      (appointment) => appointment.status === "cancelled"
    ).length;

    const pendingCount = appointments.filter(
      (appointment) => appointment.status === "pending"
    ).length;

    // Return the counts
    return {
      scheduled: scheduledCount,
      cancelled: cancelledCount,
      pending: pendingCount,
    };
  },
});

export const getAllAppointments = query({
  args: {},
  handler: async (ctx) => {
    const appointments = await ctx.db.query("appointments").collect();
    return appointments;
  },
});

export const getAppointmentById = query({
  args: {
    appointmentId: v.optional(v.id("appointments")), // ID of the appointment
  },
  handler: async (ctx, args) => {
    if (!args.appointmentId) return null;

    const appointment = await ctx.db.get(args.appointmentId);

    if (!appointment) {
      return null;
    }

    return appointment;
  },
});
