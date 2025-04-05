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
    words: Word[]
}

const PlayableGrid = ({board, words}: Props) => {
    const [gameWon, setGameWon] = useState(false);
    const [conn, connState] = useConnection()
    const [isLoading, setIsLoading] = useState(true)

    // current player instance to track
    const [player, setPlayerSession] = useState<Player | null>(null)

    // changing players state happens every time there is a new changed record in database
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        if (conn && connState === "CONNECTED" && words.length > 0) {
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
            setIsLoading(true)
            const joinGameReducer = JoinGame.builder()
                .addConnection(conn)
                .addOnSuccess(() => {
                    const gameSessionSub = SubscribeToGameSession(conn, board.id, Identity.fromString(sessionStorage.getItem('identity')), game => {
                        setPlayerSession(new Player(game))
                        setIsLoading(false)

                        // To make sure it focuses on board grid
                        document.getElementById('board_grid').scrollIntoView({
                            behavior: "smooth"
                        })
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

        // we need to make sure in this step it starts in the same cell and ends in the same cell as word
        if (words) {
            const reversedWord = words.find(value => value.word === reversedSequence)
            // in case reversed word is available we can assume there is a palindrome if normalWord && reversedWord are avilable so we will just
            let normalWord = reversedWord ? reversedWord : words.find(value => value.word === normalSequence)

            if (normalWord && normalWord.foundBy.length > 0) {
                // TODO: Update in ws api service - only one user can find word
                // in case word was already found there is no need to call reducer again - only return false - race condition will fail!
                return false
            }

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

                if (
                    sequenceStartCol === wordStartCol && sequenceStartRow === wordStartRow &&
                    sequenceEndCol === wordEndCol && sequenceEndRow === wordEndRow
                ) {
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


            <div className={'min-w-screen min-h-screen bg-sky-500 flex flex-col justify-center items-center md:p-24 z-0'}>
                <div className="relative text-stone-600 max-w-full min-w-full md:min-w-0 md:max-h-full md:max-w-full bg-white rounded-xl p-2 md:p-8 flex flex-col gap-4">

                    <div className="flex justify-end">
                        <PlayersList boardId={board.id} players={players}/>
                    </div>

                    <div className={'flex flex-col xl:flex-row items-center gap-4'}>
                        <div id={'board_grid'} className="flex-1" >
                            <MoveGrid grid={board.grid} onSequenceSelect={processSelectedSequence}/>
                        </div>
                        <div className="">
                            <WordsList boardId={board.id} words={words ?? []}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PlayableGrid;