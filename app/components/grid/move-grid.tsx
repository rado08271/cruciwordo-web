"use client"
import React, {TouchEventHandler, useEffect, useRef, useState} from 'react';
import type Cell from "~/types/cell";
import useSound from "~/hooks/use-sound";

type Props = {
    grid: Cell[][],
    onSequenceSelect?: (sequence: Cell[]) => boolean
}

const MoveGrid = ({grid, onSequenceSelect}: Props) => {
    const [startPosition, setStartPosition] = useState<Cell | null>(null)
    const [endPosition, setEndPosition] = useState<Cell | null>(null)
    const [selectedCells, setSelectedCells] = useState<Cell[]>([])
    const playClick = useSound("click")
    const playFound = useSound("success")

    // if we are on container make sure we don't allow default behaviour (reload on pull down)
    const containerRef = useRef<HTMLDivElement | null>(null);
    // track state of board
    const boardRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const eventListener = (e: TouchEvent) => {
                if (e.touches.length > 1 || e.touches[0].clientY > 0) {
                    e.preventDefault()
                }
            }

            containerRef.current?.addEventListener('touchmove', eventListener, { passive: false})

            return () => {
                containerRef.current?.removeEventListener('touchmove', eventListener, { passive: false})
            }
        }
    }, [containerRef]);



    const handleCellMouseDown = (cell: Cell) => {
        setStartPosition(cell)
        setEndPosition(null)
        setSelectedCells([cell])
    }

    const handleCellMouseOver = (cell: Cell) => {
        const prevCellsCount = selectedCells.length
        if (startPosition) {
            setEndPosition(cell)

            const cells = getCellSequence(startPosition, cell)
            setSelectedCells(cells)

            console.log(prevCellsCount, cells.length)
            if (prevCellsCount !== cells.length) {
                playClick()
            }
        }
    }

    const handleCellMouseUp = () => {
        if (startPosition && endPosition && onSequenceSelect) {
            const sequence = selectedCells.map(sequenceCells =>
                grid[sequenceCells.row][sequenceCells.col]
            )

            const foundWord = onSequenceSelect(sequence)

            if (foundWord) {
                playFound()
            }
        }

        setSelectedCells([])
        setStartPosition(null)
        setEndPosition(null)
    }

    const handleBoardTouchMove: TouchEventHandler<HTMLElement> = (event) => {
        const prevCellsCount = selectedCells.length
        if (boardRef.current !== null) {
            const cell = getCellAtPosition(event.touches)

            if (!cell) return

            if (startPosition) {
                setEndPosition(cell)

                const cells = getCellSequence(startPosition, cell)
                setSelectedCells(cells)

                if (prevCellsCount !== cells.length) {
                    playClick()
                }
            }

        }

    }

    const handleBoardTouchStart: TouchEventHandler<HTMLElement> = (event) => {
        const cell = getCellAtPosition(event.touches)
        if (!cell) return

        setStartPosition(cell)
        setEndPosition(null)
        setSelectedCells([])
    }

    const handleBoardTouchEnd = () => {
        if (startPosition && endPosition && onSequenceSelect) {
            const sequence = selectedCells.map(sequenceCells =>
                grid[sequenceCells.row][sequenceCells.col]
            )

            const foundWord = onSequenceSelect(sequence)

            if (foundWord) {
                playFound()
            }
        }

        setSelectedCells([])
        setStartPosition(null)
        setEndPosition(null)
    }

    const getCellAtPosition = (touches: React.TouchList): Cell | null => {
        if (touches.length <= 0 || !boardRef.current) return null

        const { left, top, width, height} = boardRef.current?.getBoundingClientRect()
        const { clientX, clientY } = touches[0]

        const heightOfCell = height / grid.length
        const widthOfCell = width / grid[0].length
        const relativeX = clientX - left
        const relativeY = clientY - top

        const colIndex = Math.floor(relativeX / widthOfCell)
        const rowIndex = Math.floor(relativeY / heightOfCell)

        if (
            rowIndex < 0 || rowIndex >= grid.length &&
            colIndex < 0 || colIndex >= grid[0].length
        ) {
            return null
        }

        return grid[rowIndex][colIndex]

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
        <div ref={containerRef} className={'relative flex justify-center md:p-4 p-3 overflow-hidden rounded-xl bg-blue-50'}>
            <section
                ref={boardRef}
                onTouchMove={handleBoardTouchMove}
                onTouchCancel={handleBoardTouchEnd}
                onTouchEnd={handleBoardTouchEnd}
                onTouchStart={handleBoardTouchStart}
                onMouseLeave={handleCellMouseUp}
                style={{gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`}}
                className={`relative bg-green-400 grid select-none`}>
                {
                    grid.map((row, rowId) => row.map((cell, colId) => {
                        return <React.Fragment key={`${cell.value}-${cell.row}-${cell.col}`}>
                            <CellItem
                                handleCellMouseDown={handleCellMouseDown}
                                handleCellMouseUp={handleCellMouseUp}
                                handleCellMouseOver={handleCellMouseOver}
                                cell={cell} hovered={isCellHovered(cell)}/>
                        </React.Fragment>
                    }))
                }
            </section>
        </div>
    )
};

type CellProps = {
    handleCellMouseDown: (cell: Cell) => void
    handleCellMouseOver: (cell: Cell) => void
    handleCellMouseUp: () => void
    cell: Cell
    hovered: boolean
    selected?: boolean
    found?: boolean
}

const CellItem = React.memo((
    {
        handleCellMouseDown, handleCellMouseOver, handleCellMouseUp,
        handleCellTouchStart, handleCellTouchMove, handleCellTouchEnd,
        cell, hovered
    }: CellProps
) => (
        <div
            onMouseUp={handleCellMouseUp}
            onMouseOver={() => handleCellMouseOver(cell)}
            onMouseDown={() => handleCellMouseDown(cell)}
            className={`relative col-span-1 rounded-sm border-2 border-sky-200 aspect-square text-xs md:text-lg w-5 h-5 md:w-7 md:h-7 cursor-pointer transition-colors delay-100 duration-300 ease-in-out ${hovered ? 'bg-sky-500' : `bg-white hover:bg-sky-100`}`}>
            <div className={'flex w-full h-full justify-center items-center font-mono text-center text-sky-600'}>
                {cell.value}

                {/*<div className={`absolute w-full h-full flex flex-row justify-center items-center`}>*/}
                    {cell.word.filter(word => word.foundBy.length > 0).map(word => {
                        // decide whether to process player found words as well
                        let rotation = null
                        if (word.direction === "W" || word.direction === "E") {
                            rotation = 'rotate-0'
                        } else if (word.direction === "N" || word.direction === "S") {
                            rotation = 'rotate-90'
                        } else if (word.direction === "NW" || word.direction === "SE") {
                            rotation = 'rotate-45'
                        } else if (word.direction === "NE" || word.direction === "SW") {
                            rotation = '-rotate-45'
                        }

                        return (
                            <div
                                key={`strike-${word.word}-${cell.row}-${cell.col}`}
                                style={{backgroundColor: word.foundBy.length > 0 ? `#${word.foundBy.at(0).ident3hex}` : "", touchAction: "pan-x"}}
                                className={`absolute w-full h-1 opacity-50 bg-red-500 rounded-full ${rotation}`}
                            />
                        )

                    })}
                {/*</div>*/}
            </div>

        </div>
    )
)


export default MoveGrid;


