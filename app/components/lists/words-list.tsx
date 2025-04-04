import React, {useEffect, useState} from 'react';
import useConnection from "~/hooks/use-connection";
import Loading from "~/components/common/loading/loading";
import type Word from "~/types/word";

type Props = {
    boardId: string,
    words: Word[]
}

const WordsList = ({boardId, words}: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [conn, connectionState] = useConnection()


    useEffect(() => {
        setIsLoading(false)
    }, [words]);

    return (
        <>
            {/*{isLoading && <Loading/>}*/}
            <ul className={'grid grid-cols-5 md:grid-cols-3 gap-2'}>
                {words.map(word => {
                    return <li key={word.id} className={`relative h-8 text-xl md:text-3xl`}>
                        {(word.foundBy.length > 0)
                            ? <strike>{word.word}</strike>
                            : <>{word.word}</>
                        }
                    </li>
                })}
            </ul>
        </>
    )
}

export default WordsList;