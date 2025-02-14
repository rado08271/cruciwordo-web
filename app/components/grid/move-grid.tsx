"use client"
import React from 'react';
import type {BoardModel} from "~/types/board";
import Cell from "~/components/cells/cell";
import {animated, useIsomorphicLayoutEffect, useSprings} from '@react-spring/web'

type Props = {
    board: BoardModel
}
const MoveGrid = ({board: {grid, rows, cols}}: Props) => {
    const [rowStyles, api] = useSprings(rows, (i) => ({
        from: {opacity: 0 },
    }), [])

    // const [rowStyles, api] = useSprings(10, {
    //     from: {opacity: 0 },
    //     to: { opacity: 1 },
    //     delay: 1000
    // }, [])

    useIsomorphicLayoutEffect(() => {
        api.start((i, ctrl) => (
            { to: { opacity: 1 }, delay: i * 200}
        ));
        console.log("This is some message", grid, rowStyles)
    }, []);

    return (
        <section className={'flex flex-col gap-0.5 justify-center overflow-hidden select-none items-center'}>
            {
                rowStyles.map((style, rowId, array) => {
                    const row = grid[rowId]

                    return <animated.div style={style} className={'flex flex-row'}>{
                        row.map((row, colId) => {
                            const cellId = (rowId) * rows + colId
                            return (
                                <div key={`${cellId}`}>
                                    <Cell cellId={row.value}>{row.value}</Cell>
                                </div>
                            )
                        })
                    }
                    </animated.div>
                })
            }
        </section>
    )
};

export default MoveGrid;


/*

                grid.map((row, rowId) => {



 */