"use client"

import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"

function SonnerDemo() {
  return (
    toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    )
}

export default SonnerDemo
