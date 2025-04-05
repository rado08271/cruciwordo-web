import React, {lazy, Suspense} from "react";
import type {Route} from "./+types/play";
import type {BoardDatabaseModel, WordPlacementsDatabaseModel} from "@spacetime";
import {DbConnection} from "@spacetime";
import {SubscribeToBoardId} from "~/api/subscribers/subscribe-to-board-id";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import {data} from "react-router";
import Board from "~/types/board";
import {Connection} from "~/api/connection";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";
import board from "~/types/board";
import Word from "~/types/word";
import Loading from "~/components/common/loading/loading";

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

    return (
        <Suspense fallback={
            <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}><Loading/></div>
        }>
            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                <PlayableGrid board={board} words={words}/>
            </div>
        </Suspense>
    );
}

export default Play