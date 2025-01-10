import { Button } from "@workspace/ui/components/button";
import Logo from "@workspace/ui/components/Logo";
import PlayButton from "@/components/Home/PlayButton";
import { FC } from "react";

const Page: FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center flex-col  flex-wrap ">
      <div className="realtive h-80 w-full flex items-center justify-evenly flex-wrap ">
        <Logo label="Chess Royale" type={false} />
        <div className="w-full  font-poppins animate-slideIn sm:w-1/3">
          <strong>Chess Royale: A Competitive College Showdown</strong>
          <br />
          Unleash your strategic genius with{" "}
          <strong className="text-red-400 text-lg font-playfair">
            Chess Royale
          </strong>
          , the ultimate chess platform tailored for college students. Battle
          peers from your college or across campuses, climb the leaderboards,
          and showcase your skills in exciting tournaments. Whether you're a
          grandmaster in the making or a casual player, Chess Royale is your
          arena for strategy, rivalry, and community. Join now and make every
          move count!
        </div>
      </div>
      <PlayButton />
    </div>
  );
};
export default Page;
