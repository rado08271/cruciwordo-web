import React, {lazy, Suspense, use, useCallback, useEffect, useState} from 'react';
import getBoardById from "~/api/get-board-by-id";
import Loading from "~/components/common/loading/loading";
import type {BoardModel} from "~/types/board";
import type {Route} from "./+types/play";
import useGetBoardById from "~/actions/get-board-by-id";

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;
    const board = await getBoardById(boardId);

    return { board: board }
}

const PlayableGrid = lazy(() => import('~/components/cards/playable-grid.tsx'))

const Play = ({ params, loaderData }: Route.ComponentProps ) => {
    const { board } = loaderData as {board: BoardModel}

    return (
        <>
            <Suspense fallback={<Loading/>}>{
                board
                    ? <PlayableGrid board={board}/>
                    : <Loading/>
            }
            </Suspense>

        </>
    )
};

export default Play;