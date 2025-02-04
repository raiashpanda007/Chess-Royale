"use client"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

const Slugjoin: React.FC = () => {
    const [slug, setSlug] = useState<string>("");
    const router = useRouter();
    const joinTournamentSlug = async (slug: string) => {
        try {
          const res = await axios.put(

            `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/tournament/join/slug`,
            {
              slug,
            }
          );
          if (res) {
            toast(res.data.message, {
              description: `Tournament ID: ${res.data.data.id}`,
              action: {
                label: "View",
                onClick: () => router.push(`/tournament/${res.data.data.id}`),
              },
            });
          }
        } catch (error) {
          toast("Failed to join the tournament", {
            description: JSON.stringify(error),
            action: {
              label: "Retry",
              onClick: () => joinTournamentSlug(slug),
            },
          });
        }
      };
  return (
    <>
      <Input placeholder="Enter the joining code " className="w-3/5 " value={slug} onChange={(e)=> setSlug(e.target.value)} />
      <Button variant="outline" className="font-poppins font-semibold" onClick={()=>joinTournamentSlug(slug)}>
        Join
      </Button>
    </>
  );
};
export default Slugjoin;