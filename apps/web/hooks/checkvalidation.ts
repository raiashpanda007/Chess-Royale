"use client"

import { useRouter } from "next/navigation";
const useRequireAuth = () => {
    const router = useRouter();
    router.push("/auth/signin");
    
    };
    export default useRequireAuth;