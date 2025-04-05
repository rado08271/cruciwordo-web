"use client"
import React, {useMemo, useOptimistic, useState} from 'react';
import type Cell from "~/types/cell";

type Props = {
    grid: Cell[][],
    onSequenceSelect?: (sequence: Cell[]) => boolean
}

// type SelectionPoint = { rowId: number, colId: number }

const MoveGrid = ({grid, onSequenceSelect}: Props) => {
    const [startPosition, setStartPosition] = useState<Cell | null>(null)
    const [endPosition, setEndPosition] = useState<Cell | null>(null)
    const [selectedCells, setSelectedCells] = useState<Cell[]>([])

    const handleCellMouseDown = (cell: Cell) => {
        setStartPosition(cell)
        setEndPosition(null)
        setSelectedCells([cell])
    }

    const handleCellMouseOver = (cell: Cell) => {
        if (startPosition) {
            setEndPosition(cell)

            const cells = getCellSequence(startPosition, cell)
            setSelectedCells(cells)
        }
    }

    const handleCellMouseUp = () => {
        if (startPosition && endPosition && onSequenceSelect) {
            const sequence = selectedCells.map(sequenceCells =>
                grid[sequenceCells.row][sequenceCells.col]
            )

            onSequenceSelect(sequence)
        }

        setSelectedCells([])
        setStartPosition(null)
        setEndPosition(null)
    }

    const getCellSequence = (start: Cell, end: Cell): Cell[] => {
        const cells: Cell[] = []

        const rowDiff = end.row - start.row
        const colDiff = end.col - start.col

        // horizontal
        if (rowDiff === 0) {
            const step = colDiff > 0 ? 1 : -1
            for (let col = start.col; col !== end.col + step; col += step) {
                cells.push(grid[start.row][col])
            }
        }

        // vertical
        else if (colDiff === 0) {
            const step = rowDiff > 0 ? 1 : -1
            for (let row = start.row; row !== end.row + step; row += step) {
                cells.push(grid[row][start.col])
            }

        }

        // diagonal
        else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
            const rowStep = rowDiff > 0 ? 1 : -1
            const colStep = colDiff > 0 ? 1 : -1
            let row = start.row
            let col = start.col

            while (row !== end.row + rowStep || col !== end.col + colStep) {
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

    const isCellHovered = (searchedCell: Cell): boolean => {
        return selectedCells.find(cell => cell === searchedCell) !== undefined
    }


    return (
        <div className={'relative flex justify-center'}>
            <section
                onMouseLeave={handleCellMouseUp}
                style={{gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`}}
                className={`grid p-4 overflow-hidden rounded-xl select-none bg-sky-50`}>
                {
                    grid.map((row, rowId) => row.map((cell, colId) => {
                        return <React.Fragment key={`${cell.value}-${cell.row}-${cell.col}`}>
                            <CellItem handleCellMouseUp={handleCellMouseUp} handleCellMouseDown={handleCellMouseDown} handleCellMouseOver={handleCellMouseOver} cell={cell} hovered={isCellHovered(cell)}/>
                        </React.Fragment>
                    }))
                }
            </section>
        </div>
    )
};

type CellProps = {
    handleCellMouseUp: () => void
    handleCellMouseDown: (cell: Cell) => void
    handleCellMouseOver: (cell: Cell) => void
    cell: Cell
    hovered: boolean
    selected?: boolean
    found?: boolean
}

const CellItem = React.memo((
    {handleCellMouseDown, handleCellMouseOver, cell, handleCellMouseUp, hovered}: CellProps
) => (
    <div

        onMouseUp={handleCellMouseUp}
        onMouseOver={() => handleCellMouseOver(cell)}
        onMouseDown={() => handleCellMouseDown(cell)}
        style={{backgroundColor: cell.foundBy.length > 0 ? `#${cell.foundBy.at(0).ident3hex}` : ''}}
        className={`col-span-1 rounded-sm border-2 border-sky-200 aspect-square min-w-7 min-h-7 w-7 h-7 cursor-pointer transition-colors delay-100 duration-300 ease-in-out ${hovered ? 'bg-sky-500' : `bg-white hover:bg-sky-100`}`}>
        <div
            className={'flex w-full h-full justify-center text-lg font-mono text-center text-sky-600'}>
            {cell.value}
        </div>
    </div>
))


export default MoveGrid;


