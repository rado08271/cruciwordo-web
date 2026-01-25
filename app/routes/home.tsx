import { DbConnection } from "@spacetime";
import { useEffect, useState } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router";
import FancyTextInput from "~/components/common/input/fancy-text-input";
import type { Route } from "./+types/home";

import { Identity } from "spacetimedb";
import people_talking from "~/assets/people-talking.png";
import { SpacetimeDBProvider } from "spacetimedb/react";

// loaders

//

// meta
export function meta() {
  return [
    { title: "Cruciwordo - Interactive Multiplayer Word Puzzle Game" },
    {
      name: "description",
      content:
        "Join Cruciwordo, the collaborative multiplayer word search puzzle game. Find words together in real-time, unlock solutions, and challenge friends!",
    },
    {
      name: "keywords",
      content:
        "crossword, word game, multiplayer puzzle, collaborative games, word search, online puzzle, interactive word game",
    },
    { name: "author", content: "Radoslav Figura" },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Cruciwordo" },
    { property: "og:url", content: "https://cruciwordo.com/" },
    { property: "og:title", content: "Cruciwordo - Interactive Multiplayer Word Puzzle Game" },
    {
      property: "og:description",
      content:
        "Join Cruciwordo, the collaborative multiplayer word search puzzle game. Find words together in real-time, unlock solutions, and challenge friends!",
    },
    {
      property: "og:image",
      content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg`,
    },

    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: "https://cruciwordo.com/" },
    { property: "twitter:title", content: "Cruciwordo - Interactive Multiplayer Word Puzzle Game" },
    {
      property: "twitter:description",
      content:
        "Join Cruciwordo, the collaborative multiplayer word search puzzle game. Find words together in real-time, unlock solutions, and challenge friends!",
    },
    {
      property: "twitter:image",
      content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg`,
    },

    { name: "robots", content: "index, follow" },
    { name: "language", content: "English" },
  ];
}

export const loader = async () => {
  // const connectionBuilder = DbConnection.builder()
  //     .withUri('ws://localhost:3000')
  //     .withModuleName('cruciwordo')
  //     .onConnect(console.log)
  //     .onDisconnect(console.log)
  //     .onConnectError(console.log);

  // console.log("Loader: Created connection builder", connectionBuilder);

  return {};
};

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  // const {connectionBuilder} = loaderData;
  const connectionBuilder = DbConnection.builder()
    .withUri("ws://localhost:3000")
    .withModuleName("cruciwordo")
    // .withToken(localStorage.getItem('auth_token') || undefined)
    .onConnect(console.log)
    .onDisconnect(console.log)
    .onConnectError(console.log);

  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <section
        className={
          "text-white w-screen h-screen bg-sky-500 flex flex-col justify-center items-center hover:bg-opacity-50"
        }
      >
        <h1 className={"font-header font-medium text-8xl lg:text-[20em]/[1.1em]"}>CRUCIWORDO</h1>
        <ol className={"flex flex-row gap-6 text-lg"}>
          <Link to={"/create"}>Create</Link>
          <Link to={"/how-to"}>How to play</Link>
          <Link to={"/about"}>About</Link>
        </ol>
      </section>
      <section
        className={"text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12"}
      >
        <h3 className={"font-header font-medium text-5xl"}>Welcome to Cruciwordo!</h3>
        <article className={"flex flex-row justify-center gap-16 text-xl"}>
          <p className={"flex-1"}>
            Ever dreamed of becoming a conundrum connoisseur? Welcome to your wildest dream!
            PuzzleMaster throws you in the deep end of word search mazes.
          </p>
          <p className={"flex-1"}>
            Every game is a new journey, a new puzzle, a new chance to show off your mastery.
            Embrace the challenge, unlock levels and become the PuzzleMaster of the century. Are you
            game?
          </p>
        </article>
      </section>
      <form
        className={
          "text-sky-500 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center"
        }
      >
        <h3 className={"font-header font-medium text-5xl"}>Start Playing</h3>
        <label htmlFor={"puzzle-id"} className={"w-1/2 text-xl text-center"}>
          Don’t just stand on the sidelines — dive straight into the action! The cryptic world of
          Cruciwordo awaits!
        </label>
        <FancyTextInput placeholder={"i.e. #cruciwordo"} className={"text-center"} />
        <button className={"bg-sky-500 py-2 px-4 rounded-lg text-white text-md"}>Play Now</button>
      </form>

      <section
        className={
          "text-sky-800 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center relative"
        }
      >
        <img src={people_talking} alt={"talking people outside from humaans"} />
        <div className={"flex flex-row gap-4"}>
          <FaFacebook />
          <FaSquareXTwitter />
          <FaDiscord />
          <FaInstagram />
          <FaLinkedin />
          <FaGithub />
        </div>
        <p>© 2025 - Cruciwordo. All Rights Reserved.</p>
      </section>
    </SpacetimeDBProvider>
  );
}
