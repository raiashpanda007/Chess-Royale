import { Button } from "@workspace/ui/components/button"

import { FC } from "react";

const Page: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm" className="font-sans">Button</Button>
      </div>
    </div>
  )
}
export default Page;
