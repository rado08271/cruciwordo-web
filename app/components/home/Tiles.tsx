import { useMemo, useState } from "react";
import { Identity } from "spacetimedb";
import { eq, useTable, where } from "spacetimedb/react";
import friends_solving_puzzle from "~/assets/friends-solving-puzzle.png";
import man_creating_puzzle from "~/assets/man-creating-puzzle.png";
import person_in_space from "~/assets/person-in-space.png";
import { tables } from "~/spacetime_bridge";

type TileProps = {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
};

const Tile = ({ title, description, imageSrc, altText }: TileProps) => {
  return (
    <article className={"flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full"}>
      <div className={"h-[200px] w-full flex bg-white rounded-lg justify-center items-center"}>
        <img src={imageSrc} alt={altText} className={"h-[200px] p-4 object-fill"} />
      </div>
      <div className={"pb-6"}>
        <p className={"font-header text-xl"}>{title}</p>
        <p>{description}</p>
      </div>
    </article>
  );
};

export const Tiles = () => {
  const currentUserIdentity: Identity = useMemo(
    () => Identity.fromString(localStorage.getItem("identity") || ""),
    []
  );

  // TOOD: Currently useTable where does not support Identity filtering or timestamp filtering
  // right now the client is required to filter identities and map everything manually
  const [allBoards] = useTable(tables.board);
  const [allFinishedGames] = useTable(tables.gameSession, where(eq("finished", true)));

  const userBoards = allBoards.filter(b => b.createdBy === currentUserIdentity);
  const userGames = allFinishedGames.filter(g => g.playedBy === currentUserIdentity);
  const userScore = userGames
    .map(g => g.foundWords.split("|"))
    .reduce((acc, val) => acc + val.length, 0);

  return (
    <section
      id={"stats"}
      className={
        "text-stone-600 bg-white w-screen p-8 md:p-32 overflow-hidden flex flex-col md:flex-row gap-6 justify-stretch items-stretch relative"
      }
    >
      <Tile
        title={"Boards Created"}
        description={
          userBoards.length === 0
            ? "You did not created board yet"
            : `${userBoards.length} and counting!`
        }
        imageSrc={man_creating_puzzle}
        altText={"standing man creating puzzle from humaans"}
      />

      <Tile
        title={"Games Finished"}
        description={
          userGames.length === 0
            ? "Your first finished game awaits!"
            : `${userGames} and getting better!`
        }
        imageSrc={friends_solving_puzzle}
        altText={"standing man creating puzzle from humaans"}
      />

      <Tile
        title={"Global score"}
        description={`${userScore} points`}
        imageSrc={person_in_space}
        altText={"standing man creating puzzle from humaans"}
      />
    </section>
  );
};
