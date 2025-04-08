import React from 'react';
import type Word from "~/types/word";
import {useSprings, animated, config} from "react-spring";

type Props = {
    words: Word[]
}

const WordsList = ({words}: Props) => {
    const [wordSprings, wordsSpringsApi] = useSprings(words.length, (idx) => ({
        from:   { transform: "skew(0deg,-25deg)", scaleY: 0,},
        to:     { transform: "skew(0,0)", scaleY: 1,},
        delay:  1000 + (idx) * 50,
        config: config.wobbly
    }), [])

    return (
        <>
            <ul className={'grid grid-cols-5 md:grid-cols-3 gap-2'}>
                {words.map((word, index) => {
                    const spring = wordSprings.at(index)
                    return (
                        <animated.li style={spring} key={word.id} className={`relative h-8 text-xl md:text-3xl`}>
                            {(word.foundBy.length === 0)
                                ? <a className={'text-stone-500'}>{word.word}</a>
                                : <a className={'opacity-50'} style={{color: word.foundBy.length > 0 ? `#${word.foundBy.at(0).ident3hex}` : ""}}>
                                    <strike>{word.word}</strike>
                                </a>
                            }
                        </animated.li>)
                })}
            </ul>
        </>
    )
}

export default WordsList;