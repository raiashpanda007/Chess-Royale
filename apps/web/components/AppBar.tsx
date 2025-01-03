"use client";
import LoginButton from "@workspace/ui/components/LoginButton";
import UserImageButton from "@workspace/ui/components/UserImageButton";
import { useSession } from "next-auth/react";
import Logo from "@workspace/ui/components/Logo";
const Appbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className=" h-16 w-full backdrop-blur-100 text-white flex items-center justify-between px-4 z-10 absolute">
      <Logo label="CR" type={true} />
      <div className="flex">
        {status === "authenticated" && <UserImageButton />}
        <LoginButton />
      </div>
    </div>
  );
};
export default Appbar;
