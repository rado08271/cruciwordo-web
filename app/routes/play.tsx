import {lazy, Suspense} from "react";
import Loading from "~/components/common/loading/loading";
import type {Route} from "./+types/play";
import {Connection} from "~/api/connection";
import type {BoardDatabaseModel} from "@spacetime";
import {DbConnection} from "@spacetime";
import {SubscribeToBoardId} from "~/api/subscribers/subscribe-to-board-id";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import {JoinGame} from "~/api/reducers";
import {data, isRouteErrorResponse} from "react-router";

const getBoardById = (boardId: string) => new Promise<BoardDatabaseModel>((resolve, reject) => {
    console.log("Here i am")

    DbConnection.builder()
        .withUri('ws://localhost:3000')
        .withModuleName('cruciwordo')
        .onConnect((connection: DbConnection, identity: Identity, token: string) => {
            if (connection.isActive) {
                const sub = SubscribeToBoardId(connection, boardId, board => {
                    resolve(board)
                }, error => {
                    reject(error)
                })
            }
        })
        .onConnectError((ctx, error) => {
            reject(error)
        })
        .build()
})

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;

    try {
        const board = await getBoardById(boardId)
        return {board}
    } catch (e: Error) {
        console.error("Erroror lololasdf", e)
        throw data(e.message, {status: 404})
    }
}


const PlayableGrid = lazy(() => import('~/components/cards/playable-grid.tsx'))

const Play = ({params, loaderData}: Route.ComponentProps) => {
    const {board} = loaderData as { board: BoardDatabaseModel }
    return (
        <>
            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                <PlayableGrid board={board}/>
            </div>
        </>
    );
}

export default Play