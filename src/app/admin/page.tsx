"use client";

import { columns } from "@/_features/admin/components/column";
import { StatCard } from "@/_features/admin/components/state-card";
import { DataTable } from "@/_features/admin/components/table";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

const AdminPage = () => {
  const counts = useQuery(api.appointments.getAppointmentCounts);
  const cancelCount = counts?.cancelled;
  const pendingCount = counts?.pending;
  const scheduledCount = counts?.scheduled;
  const appointments = useQuery(api.appointments.getAllAppointments);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          {scheduledCount && (
            <StatCard
              type="appointments"
              count={scheduledCount}
              label="Scheduled appointments"
              icon={"/assets/icons/appointments.svg"}
            />
          )}
          {pendingCount && (
            <StatCard
              type="pending"
              count={pendingCount}
              label="Pending appointments"
              icon={"/assets/icons/pending.svg"}
            />
          )}
          {cancelCount && (
            <StatCard
              type="cancelled"
              count={cancelCount}
              label="Cancelled appointments"
              icon={"/assets/icons/cancelled.svg"}
            />
          )}
        </section>

        {appointments && (
          <section className="admin-table">
            <DataTable
              columns={columns}
              name={appointments.map((appointment) => appointment.patientName)}
              data={appointments}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
