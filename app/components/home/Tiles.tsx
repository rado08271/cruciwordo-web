import { useState } from "react";
import friends_solving_puzzle from "~/assets/friends-solving-puzzle.png";
import man_creating_puzzle from "~/assets/man-creating-puzzle.png";
import person_in_space from "~/assets/person-in-space.png";

const Ties = () => {
  const [userBoards, setUserBoard] = useState(0);
  const [userGames, setUserGames] = useState(0);
  const [userScore, setUserScore] = useState(0);

  return (
    <section
      id={"stats"}
      className={
        "text-stone-600 bg-white w-screen p-8 md:p-32 overflow-hidden flex flex-col md:flex-row gap-6 justify-stretch items-stretch relative"
      }
    >
      <article className={"flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full"}>
        <div className={"h-[200px] w-full flex bg-white rounded-lg justify-center items-center"}>
          <img
            src={man_creating_puzzle}
            alt={"standing man creating puzzle from humaans"}
            className={"h-[200px] p-4 object-fill"}
          />
        </div>
        <div className={"pb-6"}>
          <p className={"font-header text-xl"}>Boards Created</p>
          <p>
            {userBoards === 0 ? "You did not created board yet" : `${userBoards} and counting!`}
          </p>
        </div>
      </article>
      <article className={"flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full"}>
        <div className={"h-[200px] w-full flex bg-white rounded-lg justify-center items-center"}>
          <img
            src={friends_solving_puzzle}
            alt={"standing man creating puzzle from humaans"}
            className={"h-[200px] p-4 object-fill"}
          />
        </div>
        <div className={"pb-6"}>
          <p className={"font-header text-xl"}>Games Finished</p>
          <p>
            {userGames === 0
              ? "Your first finished game awaits!"
              : `${userGames} and getting better!`}
          </p>
        </div>
      </article>
      <article className={"flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full"}>
        <div className={"h-[200px] w-full flex bg-white rounded-lg justify-center items-center"}>
          <img
            src={person_in_space}
            alt={"standing man creating puzzle from humaans"}
            className={"h-[200px] p-4 object-fill"}
          />
        </div>
        <div className={"pb-6"}>
          <p className={"font-header text-xl"}>Global score</p>
          <p>{userScore} points</p>
        </div>
      </article>
    </section>
  );
};
