"use client"
import LoginButton from "@workspace/ui/components/LoginButton";
import UserImageButton from "@workspace/ui/components/UserImageButton";
import { useSession } from "next-auth/react";
const Appbar: React.FC = () => {
  const { data: session ,status} = useSession();

  return (
    <div className="h-16 w-full backdrop-blur-100 text-white flex items-center justify-end px-4 z-10 absolute">
      {status === "authenticated" && <UserImageButton />}
      <LoginButton />
    </div>
  );
};
export default Appbar;
