import React, {memo, useEffect, useMemo, useState} from 'react';
import useConnection from "~/hooks/use-connection";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";
import type {WordPlacementsDatabaseModel} from "@spacetime";
import Loading from "~/components/common/loading/loading";
import word from "~/components/items/word";

type Props = {
    boardId: string,
    words: WordPlacementsDatabaseModel[]
}

type WordGuess = {
    guessedBy: string[],
    word: string,
    // cells:
}

const WordsList = ({boardId, words}: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [conn, connectionState] = useConnection()


    useEffect(() => {
        setIsLoading(false)
    }, [words]);

    return (
        <>
            {isLoading && <Loading/>}
            <ul className={'grid grid-cols-2 gap-2'}>
                {words.map(word => {
                    return <li key={word.id} className={'relative w-8 aspect-square h-8'}>
                        {word.word}
                    </li>
                })}
            </ul>
        </>
    )
}

export default WordsList;