import { Button } from "@workspace/ui/components/button";
import Logo from "@workspace/ui/components/Logo";
import { FC } from "react";

const Page: FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center flex-col  flex-wrap ">
      <div className="realtive h-80 w-full flex items-center justify-evenly flex-wrap">
        <Logo />
        <div className="w-1/3  font-poppins ">
          <strong>Chess Royale: A Competitive College Showdown</strong>
          <br />
          Unleash your strategic genius with{" "}
          <strong className="text-red-400 text-lg">Chess Royale</strong>, the
          ultimate chess platform tailored for college students. Battle peers
          from your college or across campuses, climb the leaderboards, and
          showcase your skills in exciting tournaments. Whether you're a
          grandmaster in the making or a casual player, Chess Royale is your
          arena for strategy, rivalry, and community. Join now and make every
          move count!
        </div>
      </div>
      <div className="w-1/2 flex justify-evenly animate-slideInFromBelow opacity-0 ">
          <Button variant={'secondary'} className="font-poppins font-bold">
            Play Solo
          </Button>
          <Button variant={'default'} className="font-poppins font-bold">
            Play Royale
          </Button>
      </div>
    </div>
  );
};
export default Page;
