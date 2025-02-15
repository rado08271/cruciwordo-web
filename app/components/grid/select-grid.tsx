import React, {useState} from 'react';
import Cell from "~/components/items/cell";

type Props = {
    rows: number
    cols: number
    onHover?: (cellId: number) => void
    onSelect?: (cellId: number) => void
    overrideCols?: number
    overrideRows?: number
}

const SelectGrid = ({rows, cols, onSelect, onHover, overrideCols = null, overrideRows = null}: Props) => {
    const [hovered, setOnHovered] = useState<null | number>(null);
    const [selected, setOnSelected] = useState<null | number>(null);

    let array = []

    for (let r = 0; r < rows; r++) {
        let tmpArr = []
        for (let c = 0; c < cols; c++) {
            tmpArr.push(c);
        }
        array.push(tmpArr);
    }

    return (
        <section className={'flex flex-col gap-0.5 justify-center overflow-hidden select-none cursor-grab'}>

            {array.map((row, rowId) =>
                <div className={'flex flex-row gap-0.5 justify-center overflow-hidden flex-nowrap'}>
                    {
                        row.map( (col, colId) => {
                            const cellId = (rowId) * (rows) + (colId)

                            const selectedRow = overrideRows ?? (selected / (rows))
                            const selectedCol = (overrideCols -1) ?? (selected % (cols))
                            const isCellSelected = rowId <= selectedRow && (colId - 1) <= selectedCol

                            const hoveredRow = hovered / (rows)
                            const hoveredCol = hovered % (cols)
                            const isCellHovered = rowId <= hoveredRow  && colId <= hoveredCol

                            return <Cell cellId={cellId} isSelected={isCellSelected} isHovered={isCellHovered} onSelect={(cell) => {
                                if (onSelect) {
                                    setOnSelected(cell)
                                    onSelect(cell)
                                }
                            }} onHover={(cell) => {
                                if (onHover) {
                                    setOnHovered(cell)
                                    onHover(cell)
                                }
                            }}/>
                        })
                    }
                </div>
            )}
        </section>
    )
};

export default SelectGrid;