import React, {useEffect, useState} from 'react';
import Card from "~/components/common/card/card";
import MoveGrid from "~/components/grid/move-grid";
import type {BoardModel} from "~/types/board";
import Confetti from 'react-confetti'

type Props = {
    board: BoardModel
}

const PlayableGrid = ({board}: Props) => {
    const [gameWon, setGameWon] = useState(false);

    return (
        <>
            <Card>
                <Card.Title>Play game</Card.Title>
                <Card.Content>
                    <MoveGrid board={board} gameWonListener={setGameWon}/>
                </Card.Content>
            </Card>
            {gameWon && <div
                className={'w-full h-full text-xl backdrop-blur z-50 absolute top-0 flex flex-col justify-around items-center'}>
                <Confetti style={{width: "100%"}}/>
                <a>You won congratulation!</a>
            </div>}
        </>
    )
};

export default PlayableGrid;