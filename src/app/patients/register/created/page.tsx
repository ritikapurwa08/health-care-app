"use client";
import { UseGetCurrentUserHook } from "@/_features/auth/hooks/user-query-hooks";
import UserPatients from "@/_features/register/components/users-patient-list";
import React from "react";

const page = () => {
  const { user } = UseGetCurrentUserHook();
  return <div>{user && <UserPatients userId={user._id} />}</div>;
};

export default page;
