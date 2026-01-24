import React, {type PropsWithChildren} from 'react';
import {animated, useSprings} from 'react-spring'

type NestedProp = {
    isSolved: boolean
}

type Props = NestedProp&{
    message: String
}

const SolutionList = ({message, isSolved}: Props) => {
    const [wordSprings, wordsSpringsApi] = useSprings(message.split(" ").length, (idx) => ({
        from:   { scale: 0,},
        to:     { scale: 1,},
        delay:  1000 + (idx) * 200
    }), [isSolved])

    return (
        <>
            <h1 className={'text-center border-t-2 py-2 text-2xl text-stone-300'}>Solution</h1>
            <div className={'flex flex-row flex-wrap justify-center items-center gap-1 px-12 pb-6 md:p-2 text-stone-500'}>
                {message.split(' ').map((word, index)=> {
                    const spring = wordSprings.at(index)
                    return <animated.span style={spring} key={`${word}-${index}`}>
                        <Word isSolved={isSolved}>{word}</Word>
                    </animated.span>
                })}
            </div>
        </>
    );
}

const Cell = ({children, isSolved}: PropsWithChildren&NestedProp) => {
    return (
        <div className={'text-xs md:text-lg w-5 h-5 md:w-7 md:h-7 aspect-square bg-slate-50 border-b-2 border-stone-200 rounded font-thin text-md flex justify-center items-center'}>
            {isSolved ? children : ''}
        </div>
    )
}

const Word = ({children, isSolved}: PropsWithChildren&NestedProp) => {
    return (
        <div className={'flex flex-row flex-wrap justify-center items-center gap-1 px-4'}>
            {typeof children === 'string' && children.split('').map((cell, index) => {
                if (RegExp('[A-Za-z]').test(cell)) {
                    return <span key={`${children}-${cell}-${index}`}>
                        <Cell isSolved={isSolved}>{cell}</Cell>
                    </span>
                } else {
                    return <div key={`${children}-${cell}-${index}`} className={'text-stone-300'}>{cell}</div>
                }
            })}
        </div>
    )


}




export default SolutionList;