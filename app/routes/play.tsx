import { lazy, Suspense, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { data, Link } from "react-router";
import { animated, useSpring } from "react-spring";
import { eq, SpacetimeDBProvider, useReducer, useSpacetimeDB, useTable, where } from "spacetimedb/react";
import Loading from "~/components/common/loading/loading";
import { BoardDatabaseModel, reducers, tables, WordPlacementsDatabaseModel } from "~/spacetime_bridge";
import Board from "~/types/board";
import Word from "~/types/word";
import type { Route } from "./+types/play";
import type { Infer } from "spacetimedb";
import { ssql } from "~/service/api";

export function meta({matches}: Route.MetaArgs) {
    const { boardId } = matches.find((route) => route && route.id === 'routes/play')?.params!
    const { boardModel, wordsModel } = matches.find((route) => route && route.id === 'routes/play')?.loaderData as LoaderDataType

    if (boardModel === null || wordsModel === null) return []

    return [
        { title: "Play Puzzle | Cruciwordo Multiplayer Word Game"},
        { name: "title", content: "Play Puzzle | Cruciwordo Multiplayer Word Game" },
        { name: "description", content: `Join a ${boardModel.rows}x${boardModel.cols} search puzzle with ${wordsModel.length} words on Cruciwordo. Collaborate with friends in real-time to find all words and unlock the hidden solution.` },
        { name: "keywords", content: "play crossword, online word puzzle, multiplayer word search, collaborative puzzle game, word challenge" },
        { name: "author", content: "Radoslav Figura" },

        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Cruciwordo" },
        { property: "og:url", content: "https://cruciwordo.com/play" },
        { property: "og:title", content: "Play Puzzle | Cruciwordo Multiplayer Word Game" },
        { property: "og:description", content: "Join a multiplayer word search puzzle on Cruciwordo. Collaborate with friends in real-time to find all words and unlock the hidden solution." },
        { property: "og:image", content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg` },

        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://cruciwordo.com/play" },
        { property: "twitter:title", content: "Play Puzzle | Cruciwordo Multiplayer Word Game" },
        { property: "twitter:description", content: "Join a multiplayer word search puzzle on Cruciwordo. Collaborate with friends in real-time to find all words and unlock the hidden solution." },
        { property: "twitter:image", content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg` },

        { name: "robots", content: "index, follow" },
        { name: "language", content: "English" },

        { property: "og:url", content: `https://cruciwordo.com/play/${boardId}` },
        { property: "twitter:url", content: "https://cruciwordo.com/play/${boardId}" },
    ];
}

type LoaderDataType = {
    boardModel: Infer<typeof BoardDatabaseModel>,
    wordsModel: Infer<typeof WordPlacementsDatabaseModel>[]
}

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;

    try {
        const boards = await ssql<Infer<typeof BoardDatabaseModel>>(`SELECT * FROM board WHERE id = '${boardId}'`);
        const words = await ssql<Infer<typeof WordPlacementsDatabaseModel>>(`SELECT * FROM word WHERE board_id = '${boardId}'`);

        return { boardModel: boards[0], wordsModel: words } as LoaderDataType;
    } catch (e: any) {
        throw data(e.message, {status: 404})
    }
}

const PlayableGrid = lazy(() => import('~/components/cards/playable-grid'))

const Play = ({params}: Route.ComponentProps) => {
    const boardId = params.boardId;


    return (
        <Suspense fallback={<Load/>}>
            {/* <PlayLayout boardId={boardId}/> */}
        </Suspense>
    );
}

type PlayLayoutProps = {
    boardId: string
}

const Load = () => 
    <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}>
        <Loading/>
    </div>

const PlayLayout = ({boardId}: PlayLayoutProps) => {
    const [boardRow, isLoaded] = useTable(tables.board, where(eq('id', boardId)))
    const [wordsRows] = useTable(tables.word, where(eq('boardId', boardId)))

    if (!boardRow.find(b => b.id === boardId)) return <Load />

    const words = wordsRows.map(wordRow => new Word(wordRow))

    const board = new Board(boardRow[0])
    board.propagateBoardWords(words)
    
    return (
        <>
            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                {/* <PlayableGrid board={board} words={words}/>  */}
            </div>
        </>
    )
}

export default Play