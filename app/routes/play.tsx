import React, {lazy, Suspense, useState} from "react";
import type {Route} from "./+types/play";
import type {BoardDatabaseModel, WordPlacementsDatabaseModel} from "@spacetime";
import {SubscribeToBoardId} from "~/api/subscribers/subscribe-to-board-id";
import {data, Link} from "react-router";
import Board from "~/types/board";
import {Connection} from "~/api/connection";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";
import Word from "~/types/word";
import Loading from "~/components/common/loading/loading";
import {TiThMenu} from "react-icons/ti";
import {animated, useSpring} from "react-spring";
import {CloseSession} from "~/api/reducers";
import useConnection from "~/hooks/use-connection";

export function meta({matches}: Route.MetaArgs) {
    const { boardId } = matches.find((route) => route && route.id === 'routes/play')?.params
    const { boardModel, wordsModel } = matches.find((route) => route && route.id === 'routes/play')?.data as LoaderDataType
    console.log("matches", boardModel)

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
        { property: "og:image", content: "https://cruciwordo.com/images/cruciwordo-play-preview.jpg" },

        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://cruciwordo.com/play" },
        { property: "twitter:title", content: "Play Puzzle | Cruciwordo Multiplayer Word Game" },
        { property: "twitter:description", content: "Join a multiplayer word search puzzle on Cruciwordo. Collaborate with friends in real-time to find all words and unlock the hidden solution." },
        { property: "twitter:image", content: "https://cruciwordo.com/images/cruciwordo-play-preview.jpg" },

        { name: "robots", content: "index, follow" },
        { name: "language", content: "English" },

        { property: "og:url", content: `https://cruciwordo.com/play/${boardId}` },
        { property: "twitter:url", content: "https://cruciwordo.com/play/${boardId}" },
    ];
}


type LoaderDataType = {
    boardModel: BoardDatabaseModel,
    wordsModel: WordPlacementsDatabaseModel[]
}
const getBoardById = (boardId: string) => new Promise<BoardDatabaseModel>((resolve, reject) => {
    const serviceConnection = new Connection(true)
        .addOnConnect(connection => {
            const sub = SubscribeToBoardId(connection, boardId, board => {
                resolve(board)
            }, error => {
                reject(error)
            })
        })
        .addOnError(error => {
            reject(error)
        })

    serviceConnection.connect()
})

const getBoardWords = (boardId: string) => new Promise<WordPlacementsDatabaseModel[]>((resolve, reject) => {
    const serviceConnection = new Connection(true)
        .addOnConnect(connection => {
            const sub = SubscribeToBoardWords(connection, boardId, words => {
                resolve(words)
            })
        })
        .addOnError(error => {
            reject(error)
        })

    serviceConnection.connect()
})

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;

    try {
        const board = await getBoardById(boardId)
        const words = await getBoardWords(boardId)
        return { boardModel: board, wordsModel: words } as LoaderDataType
    } catch (e: Error) {
        throw data(e.message, {status: 404})
    }
}

const PlayableGrid = lazy(() => import('~/components/cards/playable-grid.tsx'))

const Play = ({params, loaderData}: Route.ComponentProps) => {
    const {boardModel} = loaderData as LoaderDataType
    const {wordsModel} = loaderData as LoaderDataType

    const [conn, connState] = useConnection()
    const words = wordsModel.map(wordModel => new Word(wordModel))
    const board = new Board(boardModel)
    board.propagateBoardWords(words)

    const [showMenu, setShowMenu] = useState(false)
    const [openMenuSpring, omSpringApi] = useSpring(() => ({
        from: {opacity: 0, left: -300,},
        to: {opacity: 1, left: 0,},
        reset: true,
        reverse: !showMenu,
        config: {
            duration: 200
        }
    }), [showMenu])

    const closeMySession = () => {
        if (conn && connState === "CONNECTED") {
            const closeSessionReducer = CloseSession.builder()
                .addConnection(conn)
                .addOnSuccess(() => {
                    closeSessionReducer.stop()
                })
                .build()

            closeSessionReducer.execute(board.id)
        }
    }


    return (
        <Suspense fallback={
            <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}><Loading/>
            </div>
        }>
            <section onClick={() => setShowMenu(true)}
                     className={'absolute w-10 h-10 m-1 rounded-full bg-slate-100 top-0 left-2 right-0 z-10 flex justify-center items-center text-xl text-stone-500 active::bg-yellow-600'}>
                <TiThMenu/>
            </section>
            <animated.div onClick={() => setShowMenu(false)} style={openMenuSpring}
                          className={`fixed ${showMenu ? 'z-20' : '-z-20'} w-screen h-screen backdrop-blur-sm text-stone-500 font-bold`}>
                <ul className={'w-2/3 bg-slate-50 h-screen rounded-r-2xl font-sans text-2xl flex flex-col gap-4 justify-center items-center shadow-2xl'}>
                    <Link role={'menuitem'} to={'/'}>Go Home</Link>
                    <Link role={'menuitem'} to={'/create'}>New Game</Link>
                    <li onClick={() => closeMySession()} role={'menuitem'} className={'cursor-pointer'}>Go offline</li>
                </ul>
            </animated.div>

            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                <PlayableGrid board={board} words={words}/>
            </div>
        </Suspense>
    );
}

export default Play