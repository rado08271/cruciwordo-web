import React, {useCallback, useEffect, useState} from 'react';
import {JoinGame, WordIsFound} from "~/api/reducers";
import useConnection from "~/hooks/use-connection";
import Loading from "~/components/common/loading/loading";
import {SubscribeToGamePlayers} from "~/api/subscribers/subscribe-to-game-players";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";
import type Cell from "~/types/cell";
import type Board from "~/types/board";

import Player from "~/types/player";
import Word from "~/types/word";
import PlayersList from "~/components/lists/players-list";
import {SubscribeToGameSession} from "~/api/subscribers/subscribe-to-game-session";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import WordsList from "~/components/lists/words-list";
import MoveGrid from "~/components/grid/move-grid";
import {getDirectionVector} from "~/types/direction";

type Props = {
    board: Board
}

const PlayableGrid = ({board}: Props) => {
    const [gameWon, setGameWon] = useState(false);
    const [conn, connState] = useConnection()
    const [isLoading, setIsLoading] = useState(true)

    // current player instance to track
    const [player, setPlayerSession] = useState<Player | null>(null)

    // changing players state happens every time there is a new changed record in database
    const [players, setPlayers] = useState<Player[]>([])

    // loading words will happen only once when board is loaded
    const [words, setWords] = useState<Word[] | null>(null)

    useEffect(() => {
        if (conn && connState === "CONNECTED" && words !== null) {
            const gamePlayersSub = SubscribeToGamePlayers(conn, board.id, games => {
                const processedPlayers = games.map(session => new Player(session))
                processedPlayers.forEach(player => player.assignFoundWords(words))

                setPlayers(processedPlayers)
            })

            return () => {
                // gamePlayersSub.unsubscribe()
            }
        }
    }, [conn, connState, words])

    useEffect(() => {
        if (conn && connState === "CONNECTED") {
            const boardWordsSub = SubscribeToBoardWords(conn, board.id, wordsPlace => {
                const processedWords = wordsPlace.map((word) => new Word(word))
                board.propagateBoardWords(processedWords)

                setWords(processedWords)
            })

            return () => {
                // boardWordsSub.unsubscribe()
            }
        }
    }, [conn, connState])

    useEffect(() => {
        if (conn && connState === "CONNECTED") {
            setIsLoading(true)
            const joinGameReducer = JoinGame.builder()
                .addConnection(conn)
                .addOnSuccess(() => {
                    const gameSessionSub = SubscribeToGameSession(conn, board.id, Identity.fromString(sessionStorage.getItem('identity')), game => {
                        setPlayerSession(new Player(game))
                        setIsLoading(false)
                    })

                    joinGameReducer.stop()
                })
                .build()

            joinGameReducer.execute(board.id)

            return () => {
                // gameSessionSub.unsubscribe()
                // joinGameReducer.stop()
            }
        }
    }, [conn, connState]);

    const processSelectedSequence = useCallback((sequence: Cell[]): boolean => {
        console.table(sequence)

        const normalSequence = sequence.map(cell => cell.value).join('')
        const reversedSequence = sequence.map(cell => cell.value).reverse().join('')

        if (words) {
            const reversedWord = words.find(value => value.word === reversedSequence)
            // in case reversed word is available we can assume there is a palindrome if normalWord && reversedWord are avilable so we will just
            let normalWord = reversedWord ? reversedWord : words.find(value => value.word === normalSequence)

            if (reversedWord) {
                sequence.reverse()
            }

            if (normalWord) {
                const sequenceStartCol = sequence.at(0)?.col
                const sequenceStartRow = sequence.at(0)?.row
                const sequenceEndCol = sequence.at(sequence.length - 1)?.col
                const sequenceEndRow = sequence.at(sequence.length - 1)?.row

                const [dirCol, dirRow] = getDirectionVector(normalWord.direction)
                const wordStartCol = normalWord.startCol
                const wordStartRow = normalWord.startRow
                const wordEndCol = (normalWord.startCol + (dirCol * (normalWord.depth -1)))
                const wordEndRow = (normalWord.startRow + (dirRow * (normalWord.depth -1)))

                console.group()
                    console.info("Sequence", sequence)
                    console.group()
                        console.info("SSC", sequenceStartCol)
                        console.info("SSR", sequenceStartRow)
                        console.info("SEC", sequenceEndCol)
                        console.info("SER", sequenceEndRow)
                    console.groupEnd()

                    console.info("Word", normalWord)
                    console.group()
                        console.info("WSC", wordStartCol)
                        console.info("WSR", wordStartRow)
                        console.info("WEC", wordEndCol)
                        console.info("WER", wordEndRow)
                    console.groupEnd()
                console.groupEnd()

                if (
                    sequenceStartCol === wordStartCol && sequenceStartRow === wordStartRow &&
                    sequenceEndCol === wordEndCol && sequenceEndRow === wordEndRow
                ) {
                    console.log("Proceeding to update database on normal word!")

                    // we need to make sure in this step it starts in the same cell and ends in the same cell as word
                    const wordIsFoundReducer = WordIsFound.builder()
                        .addConnection(conn!)
                        .build()

                    wordIsFoundReducer.execute(board.id, normalWord.word)

                    return true
                }
            }
        }


        return false
    }, [words, conn, board.id])

    return (
        <>
            {
                isLoading &&
                <div
                    className={'absolute flex flex-col w-screen h-screen backdrop-blur justify-center items-center z-10 text-center'}>
                    <Loading/>
                </div>
            }


            <div className={'min-w-screen min-h-screen bg-sky-500 flex flex-col justify-center items-center p-24 z-0'}>
                <div
                    className={`relative text-stone-600 max-w-full lg:w-1/2 w-full bg-white rounded-xl p-8 grid grid-rows-2 grid-cols-6`}>
                    <div className={'row-start-2 col-start-6 col-span-1 self-end'}>
                        <PlayersList boardId={board.id} players={players}/>
                    </div>
                    <div className={'row-start-1 col-start-1 col-span-4 row-span-2 self-center w-full'}>
                        <MoveGrid grid={board.grid} onSequenceSelect={processSelectedSequence}/>
                    </div>
                    <div className={'row-start-1 row-span-full col-start-5 col-span-2 self-start'}>
                        <WordsList boardId={board.id} words={words ?? []}/>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PlayableGrid;