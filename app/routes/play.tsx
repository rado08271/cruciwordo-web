import React, {lazy, Suspense, useState} from "react";
import type {Route} from "./+types/play";
import type {BoardDatabaseModel, WordPlacementsDatabaseModel} from "@spacetime";
import {DbConnection} from "@spacetime";
import {SubscribeToBoardId} from "~/api/subscribers/subscribe-to-board-id";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import {data, Link} from "react-router";
import Board from "~/types/board";
import {Connection} from "~/api/connection";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";
import board from "~/types/board";
import Word from "~/types/word";
import Loading from "~/components/common/loading/loading";
import {TiThMenu} from "react-icons/ti";
import {animated, useSpring} from "react-spring";

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

    const words = wordsModel.map(wordModel => new Word(wordModel))
    const board = new Board(boardModel)
    board.propagateBoardWords(words)

    const [showMenu, setShowMenu] = useState(true)
    const [openMenuSpring, omSpringApi] = useSpring(() => ({
        from: {opacity: 1, left: 0,},
        to: {opacity: 1, left: 0,},
        reset: true,
        reverse: !showMenu,
        config: {
            duration: 200
        }
    }), [showMenu])
    
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
                    <li role={'menuitem'}><strike>Go offline</strike></li>
                </ul>
            </animated.div>

            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                <PlayableGrid board={board} words={words}/>
            </div>
        </Suspense>
    );
}

export default Play