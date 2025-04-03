import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MoveGrid, {type SelectionCellType} from "~/components/grid/move-grid";
import type {BoardDatabaseModel, GameSessionDatabaseModel, WordPlacementsDatabaseModel} from "@spacetime";
import {JoinGame, WordIsFound} from "~/api/reducers";
import useConnection from "~/hooks/use-connection";
import Loading from "~/components/common/loading/loading";
import {SubscribeToGameSession} from "~/api/subscribers/subscribe-to-game-session";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import {SubscribeToGamePlayers} from "~/api/subscribers/subscribe-to-game-players";
import {SubscribeToGameJoins} from "~/api/subscribers/subscribe-to-game-joins";
import PlayersList from "~/components/cards/players-list";
import WordsList from "~/components/cards/words-list";
import {SubscribeToBoardWords} from "~/api/subscribers/subscribe-to-board-words";

type Props = {
    board: BoardDatabaseModel
}

const getDirection = (dir: string): [number, number] => {
    switch (dir) {
        case "NW":  return [-1, -1];
        case "N":   return [ 0, -1];
        case "NE":  return [ 1, -1];
        case "W":   return [-1,  0];
        case "E":   return [ 1,  0];
        case "SW":  return [-1, 1];
        case "S":   return [ 0, 1];
        case "SE":  return [ 1, 1];
        default:    return [ 0, 0];
    }
}

const PlayableGrid = ({board}: Props) => {
    const [gameWon, setGameWon] = useState(false);
    const [conn, connState] = useConnection()
    const [isLoading, setIsLoading] = useState(true)

    const [userSession, setUserSession] = useState<GameSessionDatabaseModel | null>(null)
    const [players, setPlayers] = useState<GameSessionDatabaseModel[]>([])
    const [words, setWords] = useState<WordPlacementsDatabaseModel[] | null>(null)

    const generatedBoard = useMemo((): SelectionCellType[][] => {
        if (!words) return []
        // const tiles: string[][] = new Array(board.rows).fill("A")
        const tiles: SelectionCellType[][] = []
        for (let ridx = 0; ridx < board.rows; ridx++) {
            const row: SelectionCellType[] = new Array(board.cols).fill(undefined).map((value, cidx) => ({
                colId: cidx,
                rowId: ridx,
                cell: "?",
                found: false
            }))
            tiles.push(row)
        }

        // Propagate words
        for (const {startRow, startCol, direction, word}: WordPlacementsDatabaseModel of words) {
            const wordIsFoundBy = players.filter(value => value.foundWords.split("|").find(foundWord => foundWord === word))
            const [dirCol, dirRow] = getDirection(direction)
            let endRow = (startRow + (dirRow * (word.length )))
            let endCol = (startCol + (dirCol * (word.length )))

            let currentRow = startRow
            let currentCol = startCol
            let step = 0;

            console.log(`Word ${word} found by`, wordIsFoundBy)
            while (currentRow !== endRow || currentCol !== endCol) {
                tiles[currentRow][currentCol].cell = word.at(step)
                tiles[currentRow][currentCol].wordId = word
                tiles[currentRow][currentCol].found = wordIsFoundBy.length > 0

                currentRow += dirRow
                currentCol += dirCol
                step += 1;
            }
        }

        let solutionIndex = 0
        // Propagate solution
        for (const row of tiles) {
            for (const cell of row) {
                if (cell.cell === "?") {
                    cell.cell = board.solution.at(solutionIndex)
                    solutionIndex += 1
                    if (solutionIndex === board.solution.length) break;
                }
            }
        }

        return tiles
    }, [board.rows, words, board.cols, board.solution, players])

    useEffect(() => {
        if (conn && connState === "CONNECTED") {
            const gamePlayersSub = SubscribeToGamePlayers(conn, board.id, games => {
                console.log("players", games)
                setPlayers(games)
            })

            return () => {
                gamePlayersSub.unsubscribe()
            }
        }
    }, [conn, connState])

    useEffect(() => {
        if (conn && connState === "CONNECTED") {
            const boardWordsSub = SubscribeToBoardWords(conn, board.id, wordsPlace => {
                setWords(wordsPlace)

            })

            return () => {
                boardWordsSub.unsubscribe()
            }
        }
    }, [conn, connState])

    useEffect(() => {
        if (conn && connState === "CONNECTED") {
            setIsLoading(true)
            const joinGameReducer = JoinGame.builder()
                .addConnection(conn)
                .addOnError(error => {
                    console.error("Join game error", error)
                })
                .build()

            const gameSessionSub = SubscribeToGameSession(conn, board.id, Identity.fromString(sessionStorage.getItem('identity')), game => {
                setUserSession(game)
                console.log("Game session activated", game)
                setIsLoading(false)
            })

            joinGameReducer.execute(board.id)

            return () => {
                gameSessionSub.unsubscribe()
                joinGameReducer.stop()
            }
        }
    }, [conn, connState]);

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
                    className={`relative text-stone-600 max-w-full bg-white rounded-xl p-8 grid grid-rows-2 grid-cols-6`}>
                    <div className={'row-start-2 col-start-6 col-span-1 self-end'}>
                        <PlayersList boardId={board.id} players={players}/>
                    </div>
                    <div className={'row-start-1 col-start-1 col-span-4 row-span-2 self-center w-full'}>
                        <MoveGrid grid={generatedBoard} onSequenceSelect={sequence => {
                            const word = sequence.map(value => value.cell).join('')
                            console.table(sequence)

                            if (words) {
                                console.log(words.find(value => value.word === word))
                            }

                            if (words && words.find(value => value.word === word)) {
                                console.log("Wrod found processing", word)
                                const wordIsFoundReducer = WordIsFound.builder()
                                    .addConnection(conn!)
                                    .addOnError(error => {
                                        console.error("Join game error", error)
                                    })
                                    .addOnSuccess(() => {
                                        console.log("Successfully word process")
                                    })
                                    .build()

                                wordIsFoundReducer.execute(board.id, word)
                                // wordIsFoundReducer.stop()
                            }

                            return true
                        }}/>
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