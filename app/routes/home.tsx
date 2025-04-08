import type {Route} from "./+types/home";
import React, {useEffect, useState} from "react";
import {Link} from "react-router";
import FancyTextInput from "~/components/common/input/fancy-text-input";
import {FaFacebook, FaSquareXTwitter, FaDiscord, FaInstagram, FaLinkedin, FaGithub, FaImage} from "react-icons/fa6";
import useConnection from "~/hooks/use-connection";
import {SubscribeToStatsBoardsCount} from "~/api/subscribers/subscribe-to-stats-boards-count";
import {SubscribeToGameSession} from "~/api/subscribers/subscribe-to-game-session";
import {Identity} from "@clockworklabs/spacetimedb-sdk";
import Player from "~/types/player";
import {SubscribeToStatsGamesFinished} from "~/api/subscribers/subscribe-to-stats-games-finished";
import {SubscribeToStatsWordsFound} from "~/api/subscribers/subscribe-to-stats-words-found";
import {SubscribeToStatsAllBoardsCount} from "~/api/subscribers/subscribe-to-stats-all-boards";
import type {DbConnection} from "@spacetime";

import man_standing from '~/assets/man-standing-pointing.png'
import woman_walking from '~/assets/woman-standing-walking.png'
import people_talking from '~/assets/people-talking.png'
import friends_solving_puzzle from '~/assets/friends-solving-puzzle.png'
import man_creating_puzzle from '~/assets/man-creating-puzzle.png'
import person_in_space from '~/assets/person-in-space.png'

// loaders

//

// meta
export function meta({}: Route.MetaArgs) {
    return [
        {title: "Welcome to Cruciwordo"},
        {name: "description", content: "Create and solve keyword search puzzle"},
    ];
}

export default function Home() {
    const [connBoard, connStateBoard] = useConnection()
    const [allBoards, setAllBoards] = useState(0)

    const [connStats, connStatsState] = useConnection()
    const [userBoards, setUserBoard] = useState(0)
    const [userGames, setUserGames] = useState(0)

    const [connScore, connScoreState] = useConnection()
    const [userScore, setUserScore] = useState(0)

    useEffect(() => {
        if (connBoard && connStateBoard === "CONNECTED") {
            const allBoardCountSub = SubscribeToStatsAllBoardsCount(connBoard, boardsCount => {
                setAllBoards(boardsCount)
            })

            return ( () => {
                // allBoardCountSub.unsubscribe()
            })
        }
    }, [connBoard, connStateBoard]);

    useEffect(() => {
        if (connStats && connStatsState === "CONNECTED" && allBoards > 0) {
            const boardsCountSub = SubscribeToStatsBoardsCount(connStats, Identity.fromString(sessionStorage.getItem('identity')), boardsCount => {
                setUserBoard(boardsCount)
            })

            const gameFinishedCountSub = SubscribeToStatsGamesFinished(connStats, Identity.fromString(sessionStorage.getItem('identity')),  finishedSessionsCount => {
                setUserGames(finishedSessionsCount)
                console.log("games", finishedSessionsCount)
            })

            return ( () => {
                // boardsCountSub.unsubscribe()
                // gameFinishedCountSub.unsubscribe()
            })
        }
    }, [connStats, connStatsState, allBoards]);

    useEffect(() => {
        if (connScore && connScoreState === "CONNECTED" && allBoards > 0) {
            const wordScoreSub = SubscribeToStatsWordsFound(connScore, Identity.fromString(sessionStorage.getItem('identity')), score => {
                setUserScore(score)
            })

            return ( () => {
                // wordScoreSub.unsubscribe()
            })
        }
    }, [connScore, connScoreState, allBoards]);

    useEffect(() => {
        return () => {
            if (connScore) (connScore as DbConnection).disconnect();
            if (connStats) (connStats as DbConnection).disconnect();
            if (connBoard) (connBoard as DbConnection).disconnect();
        }
    }, [])

    return (
        <>
            <section
                className={'text-white w-screen h-screen bg-sky-500 flex flex-col justify-center items-center hover:bg-opacity-50'}>
                <h1 className={'font-header font-medium text-8xl lg:text-[20em]/[1.1em]'}>CRUCIWORDO</h1>
                <ol className={'flex flex-row gap-6 text-lg'}>
                    <Link to={'/create'}>Create</Link>
                    <Link to={'/how-to'}>How to play</Link>
                    <Link to={'/about'}>About</Link>
                </ol>
            </section>
            <section className={'text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12'}>
                <h3 className={'font-header font-medium text-5xl'}>Welcome to Cruciwordo!</h3>
                <article className={'flex flex-row justify-center gap-16 text-xl'}>
                    <p className={'flex-1'}>Ever dreamed of becoming a conundrum connoisseur? Welcome to your wildest
                        dream! PuzzleMaster throws you in the deep end of word search mazes.</p>
                    <p className={'flex-1'}>Every game is a new journey, a new puzzle, a new chance to show off your
                        mastery. Embrace the challenge, unlock levels and become the PuzzleMaster of the century. Are
                        you game?</p>
                </article>
            </section>
            <form className={'text-sky-500 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center'}>
                <h3 className={'font-header font-medium text-5xl'}>Start Playing</h3>
                <label htmlFor={'puzzle-id'} className={'w-1/2 text-xl text-center'}>Don’t just stand on the sidelines — dive straight into the action! The cryptic world of Cruciwordo awaits!</label>
                <FancyTextInput placeholder={'i.e. #cruciwordo'} className={'text-center'}/>
                <button className={'bg-sky-500 py-2 px-4 rounded-lg text-white text-md'}>Play Now</button>
            </form>
            <section className={'text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-6 justify-center items-center relative'}>
                <h2 className={'text-5xl font-header z-10'}>We have made</h2>
                <h2 className={'text-5xl font-header text-amber-400'}>{allBoards}</h2>
                <h2 className={'text-5xl font-header'}>games already!</h2>
                <img src={man_standing} alt={'standing man pointing from humaans'} className={'absolute invisible md:visible md:left-32 lg:left-64 h-2/3'}/>
                <img src={woman_walking} alt={'walking woman from humaans'} className={'absolute invisible md:visible md:right-32 lg:right-64 h-2/3'}/>
            </section>
            <section id={'stats'}
                className={'text-stone-600 bg-white w-screen p-8 md:p-32 overflow-hidden flex flex-col md:flex-row gap-6 justify-stretch items-stretch relative'}>
                <article className={'flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <img src={man_creating_puzzle} alt={'standing man creating puzzle from humaans'} className={'h-[200px] p-4 object-fill'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Boards Created</p>
                        <p>{userBoards === 0 ? "You did not created board yet" : `${userBoards} and counting!`}</p>
                    </div>
                </article>
                <article className={'flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <img src={friends_solving_puzzle} alt={'standing man creating puzzle from humaans'}
                             className={'h-[200px] p-4 object-fill'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Games Finished</p>
                        <p>{userGames === 0 ? "Your first finished game awaits!" : `${userGames} and getting better!`}</p>
                    </div>
                </article>
                <article className={'flex-1 bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <img src={person_in_space} alt={'standing man creating puzzle from humaans'}
                             className={'h-[200px] p-4 object-fill'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Global score</p>
                        <p>{userScore} points</p>
                    </div>
                </article>
            </section>

            <section className={'text-sky-800 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center relative'}>
                <img src={people_talking} alt={'talking people outside from humaans'}/>
                <div className={'flex flex-row gap-4'}>
                    <FaFacebook/>
                    <FaSquareXTwitter/>
                    <FaDiscord/>
                    <FaInstagram/>
                    <FaLinkedin/>
                    <FaGithub/>
                </div>
                <p>© 2025 - Cruciwordo. All Rights Reserved.</p>
            </section>
        </>
    )
}
