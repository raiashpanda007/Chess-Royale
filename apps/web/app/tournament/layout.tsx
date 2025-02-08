import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-utlis";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await getAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <>{children}</>;
};

export default DashboardLayout;
