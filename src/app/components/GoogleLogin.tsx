"use client";

import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function GoogleLogin() {
  const { data: session } = useSession();

  const handleAuthAction = () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {session && <span>Signed in as {session.user?.email}</span>}
      <Button onClick={handleAuthAction}>
        {session ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
