import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@workspace/ui/components/button";
function LoginButton() {
  return <Button className="font-poppins font-semibold" onClick={() => signIn()}>Login</Button>;
}

export default LoginButton;
