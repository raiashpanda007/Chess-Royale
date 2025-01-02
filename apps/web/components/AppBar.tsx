"use client";
import { signIn, signOut } from "next-auth/react"
import LoginButton from "@workspace/ui/components/LoginButton"
import { useSession } from "next-auth/react";
 const Appbar = () => {
    const session = useSession();
    return <div className="h-16 backdrop-blur-100 text-white flex items-center justify-between px-4">
    <LoginButton />
    {JSON.stringify(session.data?.user)}
  </div>
}
export default Appbar;