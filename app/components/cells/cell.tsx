import type {PropsWithChildren} from "react";
import React from 'react';

type Props = PropsWithChildren&{
    cellId: number | string
    isSelected?: boolean
    isHovered?: boolean
    onSelect?: (cellId: number) => void
    onHover?: (cellId: number) => void
    // children: ReactNode
}

const Cell = ({isSelected, isHovered, onSelect, onHover, cellId, children}: Props) => {
    let background = '';

    if (isSelected && isHovered) {
        background = 'bg-gray-600'
    } else if (isSelected) {
        background = 'bg-gray-500'
    } else if (isHovered) {
        background = 'bg-gray-300'
    }

    return (
        <div
            key={cellId}
            onClick={() => {
                if (onSelect && typeof cellId == 'number') {
                    onSelect(cellId)
                }
            }}
            onMouseOver={() => {
                if (onHover && typeof cellId == 'number') {
                    onHover(cellId)
                }
            }}
            className={`w-8 aspect-square rounded border-2 content-center justify-center text-center text-black overflow-hidden border-gray-100 ${background}`}>{children}</div>
    )
}

export default Cell;