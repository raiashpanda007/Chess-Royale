"use client";
import React,{useState} from "react";
import { CopyAll } from "@mui/icons-material";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";

interface CopyButtonProps {
  data: string;
}
function CopyButton({ data }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
  const copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
  };
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          onClick={() => copyToClipboard(data)}
          className="font-poppins font-semibold"
          variant={"ghost"}
        >
          <CopyAll />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className={copied?"font-poppins font-semibold text-sm w-20 h-12 text-green-500":"font-poppins font-semibold text-sm w-20 h-12"}>
        {copied ? "Copied!!" : "Copy"}
      </HoverCardContent>
    </HoverCard>
  );
}
export default CopyButton;
