"use client";
import React from "react";

import { signIn , signOut} from "next-auth/react";
import { useSession } from "next-auth/react";

import { Button } from "@workspace/ui/components/button";
import { Logout } from "@mui/icons-material";
function LoginButton() {
    const { status } = useSession();
    
  return (
    <>
    {status==='authenticated' ? (
      <Button onClick={() => signOut()} className="font-poppins font-semibold" variant={'destructive'}>Logout<Logout/></Button>
    ) : (
      <Button onClick={() => signIn()} className="font-poppins font-semibold">Login</Button>
    )}
    
    </>
  )
}

export default LoginButton;
