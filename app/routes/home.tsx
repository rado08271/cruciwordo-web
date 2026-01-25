import { SpacetimeDBProvider } from "spacetimedb/react";
import type { Route } from "./+types/home";
import HomePage from "~/components/home";
import { DbConnection, DbConnectionBuilder } from "@spacetime";
import { useEffect, useState } from "react";

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

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home() {
  const [connectionBuilder, setConnectionBuilder] = useState<DbConnectionBuilder | null>(null);

  useEffect(() => {
    setConnectionBuilder(
      DbConnection.builder()
        .withUri("ws://localhost:3000")
        .withModuleName("cruciwordo")
        .withToken(localStorage.getItem("auth_token") || undefined)
        .onConnect((conn, identity, token) => {
          sessionStorage.setItem("auth_token", token);
          localStorage.setItem("identity", identity.toHexString());
        })
    );
  }, []);

  if (connectionBuilder === null) {
    return <div>Loading...</div>;
  }
  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <HomePage />;
    </SpacetimeDBProvider>
  );
}
