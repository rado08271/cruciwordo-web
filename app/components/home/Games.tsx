import { useState } from "react";
import man_standing from "~/assets/man-standing-pointing.png";
import woman_walking from "~/assets/woman-standing-walking.png";

const Games = () => {
  const [allBoards, setAllBoards] = useState(0);

  return (
    <section
      className={
        "text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-6 justify-center items-center relative"
      }
    >
      <h2 className={"text-5xl font-header z-10"}>We have made</h2>
      <h2 className={"text-5xl font-header text-amber-400"}>{allBoards}</h2>
      <h2 className={"text-5xl font-header"}>games already!</h2>
      <img
        src={man_standing}
        alt={"standing man pointing from humaans"}
        className={"absolute invisible md:visible md:left-32 lg:left-64 h-2/3"}
      />
      <img
        src={woman_walking}
        alt={"walking woman from humaans"}
        className={"absolute invisible md:visible md:right-32 lg:right-64 h-2/3"}
      />
    </section>
  );
};

export default Games;
