"use client";
import React from "react";
import UserSignUp from "./user-sign-up";
import UserSignIn from "./user-sign-in";
import { Button } from "@/components/ui/button";

const UserLayout = () => {
  const [showSignUp, setShowSignUp] = React.useState(false);
  const handleShowSignUp = () => {
    setShowSignUp((prev) => !prev);
  };
  return (
    <main className="">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Get started with appointments.</p>
      </section>
      <div>{showSignUp ? <UserSignUp /> : <UserSignIn />}</div>
      <Button variant="link" onClick={handleShowSignUp}>
        {showSignUp
          ? "already have an account ? Sign In"
          : "dont have an account sign up"}
      </Button>
    </main>
  );
};
export default UserLayout;
