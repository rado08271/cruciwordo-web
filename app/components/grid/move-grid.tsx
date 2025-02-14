"use client"
import React, {useState} from 'react';
import type {BoardModel} from "~/types/board";
import {animated, useIsomorphicLayoutEffect, useSpring, useSprings} from '@react-spring/web'
import cell from "~/components/items/cell";
import {BsEye, BsEyeSlash} from "react-icons/bs";
import OutlinedContainer from "~/components/common/container/outlined-container";

type Props = {
    board: BoardModel
}
const MoveGrid = ({board: {grid, rows, history}}: Props) => {
    const [selectedCells, setSelectCells] = useState<[number, number][]>([])
    const [hoveredCells, setHoveredCells] = useState<[number, number][]>([])
    const [showMore, setShowMore] = useState(false)
    // const [wordsHistory, setWordsHistory] = useState<{words: string, found: false}[]>([])

    const [wordSpring, wordsApi] = useSpring({from: {opacity: 0}}, [showMore])
    const [rowStyles, api] = useSprings(rows, (i) => ({
        from: {opacity: 0},
    }), [])

    useIsomorphicLayoutEffect(() => {
        api.start((i, ctrl) => (
            {to: {opacity: 1}, delay: i * 200}
        ));
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (showMore) {
            wordsApi.start(
                {to: {opacity: 1}}
            )
        } else {
            wordsApi.start({to: {opacity: 0}})
        }
    }, [showMore])

    const getAffectedCells = (startRow: number, startCol: number, endRow: number, endCol: number): [number, number][] => {
        const cells: [number, number][] = []
        const rowStep = startRow < endRow ? 1 : startRow > endRow ? -1 : 0
        const colStep = startCol < endCol ? 1 : startCol > endCol ? -1 : 0

        let currentRow = startRow
        let currentCol = startCol

        while (currentRow !== endRow || currentCol !== endCol) {
            cells.push([currentRow, currentCol])
            currentRow += rowStep
            currentCol += colStep
        }
        cells.push([endRow, endCol])

        return cells
    }

    const handleCellClick = (row: number, col: number) => {
        if (selectedCells.length === 0) {
            setSelectCells([[row, col]])
        } else if (selectedCells.length === 1) {
            const [startRow, startCol] = selectedCells[0]

            const rowDiff = Math.abs(row - startRow)
            const colDiff = Math.abs(col - startCol)
            if (
                (rowDiff === 0 && colDiff > 0) || // Horizontal
                (colDiff === 0 && rowDiff > 0) || // Vertical
                (rowDiff === colDiff && rowDiff > 0) // Diagonal
            ) {
                const newSelectedCells = getAffectedCells(startRow, startCol, row, col)
                setSelectCells(newSelectedCells)
                checkWord(newSelectedCells)
            } else {
                setSelectCells([[row, col]])
            }
        } else {
            setSelectCells([[row, col]])
        }
    }

    const handleCellMovement = (row: number, col: number) => {

        if (selectedCells.length == 0) {
            // visible hovering when not in line
            setHoveredCells([[row, col]])
        } else if (selectedCells.length === 1) {
            const [startRow, startCol] = selectedCells[0]

            const rowDiff = Math.abs(row - startRow)
            const colDiff = Math.abs(col - startCol)
            if (
                (rowDiff === 0 && colDiff > 0) || // Horizontal
                (colDiff === 0 && rowDiff > 0) || // Vertical
                (rowDiff === colDiff && rowDiff > 0) // Diagonal
            ) {
                const newSelectedCells = getAffectedCells(startRow, startCol, row, col)
                setHoveredCells(newSelectedCells)
            } else {
                // makes any possible and not possible movements visible
                // setHoveredCells(prevState => [...prevState, [row, col]])
                // nothing visible when not in line
                // setHoveredCells([])
                // Visible current view when out of line
                setHoveredCells([[row, col]])
            }
        } else {
            setHoveredCells([[row, col]])
        }
    }

    const checkWord = (cells: [number, number][]) => {
        const word = cells.map(([row, col]) => grid[row][col].value).join("")
        const reversedWord = word.split("").reverse().join("")
        const wordsToFind = history.map(value => value.word)
        const foundWords = []

        if (wordsToFind.includes(word) && !foundWords.includes(word)) {
            console.log('word found', word)
            // setFoundWords([...foundWords, word])
        } else if (wordsToFind.includes(reversedWord) && !foundWords.includes(reversedWord)) {
            console.log('reversed word found', reversedWord)
            // setFoundWords([...foundWords, reversedWord])
        }
    }

    const isCellSelected = (row: number, col: number) => {
        return selectedCells.some(([r, c]) => r === row && c === col)
    }
    const isCellHovered = (row: number, col: number) => {
        return hoveredCells.some(([r, c]) => r === row && c === col)
    }

    return (
        <div className={'flex flex-col gap-8'}>

            <section className={'flex flex-col gap-0.5 justify-center overflow-hidden select-none items-center'}>
                {
                    rowStyles.map((style, rowId, array) =>
                        <animated.div style={style} className={'flex flex-row gap-0.5 w-full justify-between'}>
                            {
                                grid[rowId].map((cell, colId) => {
                                    return <article
                                        onClick={() => handleCellClick(rowId, colId)}
                                        onMouseOver={() => handleCellMovement(rowId, colId)}
                                        className={`flex flex-col justify-center border-2 w-full ${isCellSelected(rowId, colId) ? 'bg-slate-500' : (isCellHovered(rowId, colId) ? 'bg-slate-300' : '')}`}>
                                        {/*<div className={'flex text-center justify-center text-sm flex-row'}>*/}
                                        {/*    <div className={'flex-1'}>{rowId + 1}</div>*/}
                                        {/*    <div className={'flex-1'}>{colId + 1}</div>*/}
                                        {/*</div>*/}
                                        <div className={'justify-center text-xl items-center text-center'}>
                                            <div>{cell.value}</div>
                                        </div>
                                        {/*<div className={'justify-center text-sm items-center text-center'}>*/}
                                        {/*    <div>{cell.solution ? "true" : "false"}</div>*/}
                                        {/*</div>*/}
                                    </article>
                                })
                            }
                        </animated.div>
                    )
                }
            </section>
            <section>
                <div onClick={() => setShowMore(!showMore)}
                     className={'w-full gap-2 text-center inline-flex justify-center items-center text-blue-400 cursor-pointer'}>
                    <span>{showMore ? <BsEyeSlash/> : <BsEye/>}</span>
                    <h1>{showMore ? "Hide" : "Show"}&nbsp;All Words</h1>
                </div>

                {<animated.div style={wordSpring}>
                    <OutlinedContainer className={'flex w-full flex-wrap gap-1 overflow-hidden'}>
                        {history ? history.map((history, index) =>
                            <span className={''}>
                                {history.word}
                            </span>
                        ) : <></>}
                    </OutlinedContainer>
                </animated.div>}
            </section>
        </div>
    )
};

export default MoveGrid;
