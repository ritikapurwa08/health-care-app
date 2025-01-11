import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const Schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    role: v.string(),
    email: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_email", ["email"]),
  // Your other tables...
});

export default Schema;
