"use client"
import React, {useState} from 'react';
import {animated} from '@react-spring/web'

type Props = {
    grid: string[][],
}

const MoveGrid = ({grid}: Props) => {
    const [selectedCells, setSelectCells] = useState<[number, number][]>([])
    const [hoveredCells, setHoveredCells] = useState<[number, number][]>([])
    const [removedCells, setRemovedCells] = useState<[number, number][]>([])

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

    // const checkWordAgainstSequence = (step: HistoryModel, sequence: [number, number][]): boolean => {
    //     const {word, row, col, direction} = step;
    //     const depth = word.length
    //
    //     // make sure first that we selected same number of cells
    //     if (sequence.length != depth) {
    //         return false
    //     }
    //
    //     const [rowVector, colVector] = getDirectionVectorPath(direction)
    //
    //     console.log(
    //         '\nWorking on \n',
    //         word,
    //         sequence.length,
    //         word.length,
    //         direction,
    //         "\nStart Word\n",
    //         row,
    //         col,
    //         "\nEnd Word\n",
    //         row + (rowVector * (depth - 1)),
    //         col + (colVector * (depth - 1)),
    //         "\nStart Sequence\n",
    //         sequence[0][0],
    //         sequence[0][1],
    //         "\nEnd Sequence\n",
    //         sequence[sequence.length - 1][0],
    //         sequence[sequence.length - 1][1]
    //     )
    //
    //     for (let depthIdx = 0; depthIdx < depth; depthIdx++) {
    //         const [sequenceStartRow, sequenceStartCol] = sequence[depthIdx]
    //         const [sequenceEndRow, sequenceEndCol] = sequence[(sequence.length - 1) - depthIdx]
    //
    //         let currentRow = row + (rowVector * depthIdx)
    //         let currentCol = col + (colVector * depthIdx)
    //
    //         if (
    //             (sequenceStartRow == currentRow && sequenceStartCol == currentCol) ||
    //             (sequenceEndRow == currentRow && sequenceEndCol == currentCol)
    //         ) {
    //
    //         } else {
    //             return false
    //         }
    //     }
    //
    //     // TODO : case word is part of word of other word
    //     return true
    // }

    // const checkWord = (cells: [number, number][]) => {
    //     const word = cells.map(([row, col]) => grid[row][col].value).join("")
    //     const reversedWord = word.split("").reverse().join("")
    //     const [startingPositionRow, startingPositionCol] = cells[0]
    //
    //     const includesWord = history.find(word => checkWordAgainstSequence(word, cells))
    //
    //     // word was found
    //     if (includesWord) {
    //         setRemovedCells(prevState => [...prevState, ...cells])
    //         setWordsHistory(prevState => {
    //             const wordIndex = prevState.findIndex(value => value.words === includesWord.word)
    //             prevState.at(wordIndex).found = true
    //
    //             if (prevState.filter(word => !word.found).length == 0) {
    //                 setGameWon(true)
    //             }
    //
    //             return prevState
    //         })
    //     }
    // }

    const isCellSelected = (row: number, col: number) => {
        return selectedCells.some(([r, c]) => r === row && c === col)
    }
    const isCellHovered = (row: number, col: number) => {
        return hoveredCells.some(([r, c]) => r === row && c === col)
    }

    const isCellRemoved = (row: number, col: number) => {
        return removedCells.some(([r, c]) => r === row && c === col)
    }

    return (
        <div className={'relative flex justify-center'}>
            <section style={{gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`}} className={`grid gap-1 p-4 overflow-hidden rounded-xl select-none bg-sky-50`}>
                {
                    grid.map( (row, rowId) => row.map((cell, colId) => {
                        return <article
                            onClick={() => handleCellClick(rowId, colId)}
                            onMouseOver={() => handleCellMovement(rowId, colId)}
                            className={`col-span-1 rounded-sm border-2 border-sky-200 bg-white aspect-square w-7 h-7 ${isCellRemoved(rowId, colId) ? 'text-red-500' : ''} ${isCellSelected(rowId, colId) ? 'bg-sky-300' : (isCellHovered(rowId, colId) ? 'bg-sky-200' : '')}`}>
                            <div
                                className={'flex w-full h-full justify-center text-lg font-mono text-center text-sky-600'}>
                                {cell}
                            </div>
                        </article>
                    }))
                }
            </section>
        </div>
    )
};

export default MoveGrid;


