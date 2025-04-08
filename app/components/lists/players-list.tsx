import React from 'react';
import {TbDots} from "react-icons/tb";
import type Player from "~/types/player";

type Props = {
    players: Player[]
}

const PlayersList = ({players}: Props) => {
    return (
        <>
            <ul className={'flex flex-row gap-2 min-h-8'}>
                {players.slice(0, 5).map((player, index) => (
                        <li key={player.id} style={{ backgroundColor: `#${player.ident3hex}`}} className={`relative rounded-full w-8 aspect-square h-8`}>
                            <span className={`absolute aspect-square p-1 rounded-l-full rounded-tr-full bottom-0 right-0 font-light text-xs ${ player.isOnline ? 'bg-green-400' : 'bg-slate-300'}`}>
                                {player.foundWords.length}
                            </span>
                        </li>
                ))}
                {players.length > 5 && <TbDots className={'text-stone-300 self-center'}/>}
            </ul>
        </>
    );
}

export default PlayersList;