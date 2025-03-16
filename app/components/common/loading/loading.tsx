'use client'
import React, {useEffect, useState} from 'react';
import {useIsomorphicLayoutEffect, useTrail, animated, useSprings} from "react-spring";

type Props = {
    title?: string
}
const Loading = ({title}: Props) => {
    const [attempt, setAttempt] = useState(0)
    const [springs, api] = useSprings(9, (idx) => ({
        from: {scale: 1},
        config: {
            bounce: 100,
            tension: 24,
            friction: 64
        },
    }), [])

    useIsomorphicLayoutEffect(() => {
        api.start((idx, ctrl) => ({
            scale: 0,
            from: {scale: 0},
            to: {scale: 1},
            delay: idx * 100,
            loop: false,
            reverse: false,
            onResolve: () => {
                setAttempt(attempt + 1)
            },
            config: {
                bounce: 10,
                tension: 40,
                friction: 10
            },
        }))
    }, [api, attempt]);

    const roundIt = (index) => {
        if (index === 0) {
            return 'rounded-tl-md'
        } else if (index === 2) {
            return 'rounded-tr-md'
        } else if (index === 6) {
            return 'rounded-bl-md'
        } else if (index === 8) {
            return 'rounded-br-md'
        }
        return ''
    }

    return (
        <div className={'grid grid-cols-3 grid-rows-3'}>
            {springs.map((style, index) => {

                return (
                    <animated.div key={index} style={style} className={`p-3 border-2 border-sky-500 w-4 aspect-square ${roundIt(index)}`}>
                    </animated.div>
                )
            })}
        </div>
    )
}

export default Loading;