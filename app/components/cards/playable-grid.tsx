import React, {useEffect} from 'react';
import Card from "~/components/common/card/card";
import MoveGrid from "~/components/grid/move-grid";
import type {BoardModel} from "~/types/board";
import useGetBoardById from "~/actions/get-board-by-id";

type Props = {
    board: BoardModel
}

const PlayableGrid = ({board}: Props) => {
    return (
        <>
            <Card>
                <Card.Title>Play game</Card.Title>
                <Card.Content>
                    <MoveGrid board={board}/>
                </Card.Content>
            </Card>
        </>
    )
};

export default PlayableGrid;