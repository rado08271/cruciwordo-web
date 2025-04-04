import React, {lazy} from "react";
import type {Route} from "./+types/play";
import type {BoardDatabaseModel} from "@spacetime";
import {DbConnection} from "@spacetime";
import {SubscribeToBoardId} from "~/api/subscribers/subscribe-to-board-id";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import {data} from "react-router";
import Board from "~/types/board";
import {Connection} from "~/api/connection";

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

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;

    try {
        const board = await getBoardById(boardId)
        return { board }
    } catch (e: Error) {
        throw data(e.message, {status: 404})
    }
}


const PlayableGrid = lazy(() => import('~/components/cards/playable-grid.tsx'))

const Play = ({params, loaderData}: Route.ComponentProps) => {
    const {board} = loaderData as { board: BoardDatabaseModel }

    return (
        <>
            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                <PlayableGrid board={new Board(board)}/>
            </div>
        </>
    );
}

export default Play