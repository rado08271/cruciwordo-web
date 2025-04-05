import React, {useEffect, useState} from 'react';
import useConnection from "~/hooks/use-connection";
import Loading from "~/components/common/loading/loading";
import {TbDots} from "react-icons/tb";
import {getRandomTailwindColor} from "~/utils/colors";
import type Player from "~/types/player";

type Props = {
    boardId: string
    players: Player[]
}

const PlayersList = ({boardId, players}: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [conn, connectionState] = useConnection()

    useEffect(() => {
        setIsLoading(false)
    }, [players]);

    return (
        <>
            {/*{isLoading && <Loading></Loading>}*/}
            <ul className={'flex flex-row gap-2 min-h-8'}>
                {players.map((player, index) => {
                    if (index > 1) {
                        return <TbDots className={'text-stone-300 self-center'}/>
                    } else {
                        return (
                            <li key={player.id} style={{ backgroundColor: `#${player.ident3hex}`}} className={`relative rounded-full w-8 aspect-square h-8`}>
                                {/*{player.isOnline && <span className={'absolute w-2.5 h-2.5 aspect-square rounded-l-full rounded-tr-full bg-green-400 bottom-0 right-0'}></span>}*/}
                                <span className={'absolute aspect-square p-1 rounded-l-full rounded-tr-full bg-green-400 bottom-0 right-0 font-light text-xs'}>
                                    {player.foundWords.length}
                                </span>
                            </li>
                        )
                    }
                })}
            </ul>
        </>
    );
}

export default PlayersList;