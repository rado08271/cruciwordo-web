import {lazy, Suspense} from "react";
import Loading from "~/components/common/loading/loading";
import type {Route} from "./+types/play";

export async function loader({params}: Route.LoaderArgs) {
    let boardId = params.boardId;

    return { board: boardId }
}

const PlayableGrid = lazy(() => import('~/components/cards/playable-grid.tsx'))

const Play = ({ params, loaderData }: Route.ComponentProps) => {
    const { board } = loaderData as {board: string}
    return (
        <>
            <div className={'min-h-screen min-w-screen bg-sky-400 text-white font-header text-3xl'}>
                apppaapapa {board}
            </div>
        </>
    );
}

export default Play