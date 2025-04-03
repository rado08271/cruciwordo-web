"use client"
import React, {useMemo, useState} from 'react';
import {animated} from '@react-spring/web'
import {abs} from "stylis";

type Props = {
    grid: SelectionCellType[][],
    onSequenceSelect?: (sequence: SelectionCellType[]) => boolean
}

export type SelectionCellType = {
    rowId: number,
    colId: number
    cell: string
    wordId?: string,
    found?: boolean,
}

// type SelectionPoint = { rowId: number, colId: number }

const MoveGrid = ({grid, onSequenceSelect}: Props) => {
    const [startPosition, setStartPosition] = useState<SelectionCellType | null>(null)
    const [endPosition, setEndPosition] = useState<SelectionCellType | null>(null)
    const [selectedCells, setSelectedCells] = useState<SelectionCellType[]>([])
    const [isValidSequence, setIsValidSequence] = useState(false)
    // const colors: {[key: string]: string } = {
    //     "ORANGE": "bg-blue-400",
    //     "ZONE": "bg-red-100",
    //     "ANGER": "bg-indigo-400"
    // }
    // const colors = useMemo(() => {
    //     const colorValues: {[key: string]: string} = {}
    //
    //     for (const row of grid) {
    //         for (const cell of row) {
    //             if (cell.wordId && !colorValues[cell.wordId]) {
    //                 colorValues[cell.wordId] = getRandomTailwindColor()
    //                 console.log(cell.wordId , colorValues[cell.wordId], colorValues)
    //             }
    //         }
    //     }
    //
    //     return colorValues
    // }, [grid])

    const handleCellMouseDown = (cell: SelectionCellType) => {
        setStartPosition(cell)
        setEndPosition(null)
        setSelectedCells([cell])
    }

    const handleCellMouseOver = (cell: SelectionCellType) => {
        if (startPosition) {
            setEndPosition(cell)

            const cells = getCellSequence(startPosition, cell)
            setSelectedCells(cells)
        }
    }

    const handleCellMouseUp = () => {
        if (startPosition && endPosition && onSequenceSelect) {
            const sequence = selectedCells.map(sequenceCells =>
                grid[sequenceCells.rowId][sequenceCells.colId]
            )

            setIsValidSequence(
                onSequenceSelect(sequence)
            )
        }

        setSelectedCells([])
        setStartPosition(null)
        setEndPosition(null)
    }

    const getCellSequence = (start: SelectionCellType, end: SelectionCellType): SelectionCellType[] => {
        const cells: SelectionCellType[] = []

        const rowDiff = end.rowId - start.rowId
        const colDiff = end.colId - start.colId

        // horizontal
        if (rowDiff === 0) {
            const step = colDiff > 0 ? 1 : -1
            for (let col = start.colId; col !== end.colId + step; col += step) {
                cells.push(grid[start.rowId][col])
            }
        }

        // vertical
        else if (colDiff === 0) {
            const step = rowDiff > 0 ? 1 : -1
            for (let row = start.rowId; row !== end.rowId + step; row += step) {
                cells.push(grid[row][start.colId])
            }

        }

        // diagonal
        else if (abs(rowDiff) === abs(colDiff)) {
            const rowStep = rowDiff > 0 ? 1 : -1
            const colStep = colDiff > 0 ? 1 : -1
            let row = start.rowId
            let col = start.colId

            while (row !== end.rowId + rowStep || col !== end.colId + colStep) {
                cells.push(grid[row][col])
                row += rowStep
                col += colStep

                if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) break
            }
        } else {
            cells.push(start)
            cells.push(end)
        }

        return cells
    }

    const isCellHovered = (rowId: number, colId: number): boolean => {
        return selectedCells.find(cell => cell.rowId === rowId && cell.colId === colId) !== undefined
    }

    return (
        <div className={'relative flex justify-center'}>
            <section
                onMouseLeave={handleCellMouseUp}
                style={{gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`}}
                className={`grid p-4 overflow-hidden rounded-xl select-none bg-sky-50`}>
                {
                    grid.map((row, rowId) => row.map((cell, colId) => {
                        return <article
                            key={`${cell.cell}-${cell.rowId}-${cell.colId}`}
                            onMouseUp={handleCellMouseUp}
                            onMouseOver={() => handleCellMouseOver(cell)}
                            onMouseDown={() => handleCellMouseDown(cell)}
                            className={`col-span-1 rounded-sm border-2 border-sky-200 aspect-square w-7 h-7 cursor-pointer transition-colors delay-100 duration-300 ease-in-out ${isCellHovered(rowId, colId) ? 'bg-sky-500' : `${cell.found ? "bg-green-400" : "bg-white"} hover:bg-sky-100`}`}>
                            <div
                                className={'flex w-full h-full justify-center text-lg font-mono text-center text-sky-600'}>
                                {cell.cell}
                            </div>
                        </article>
                    }))
                }
            </section>
        </div>
    )
};

export default MoveGrid;


