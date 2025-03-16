import type {Route} from "./+types/home";
import React from "react";
import {Link} from "react-router";
import FancyTextInput from "~/components/common/input/fancy-text-input";
import man_standing from '~/assets/man-standing-pointing.png'
import woman_walking from '~/assets/woman-standing-walking.png'
import people_talking from '~/assets/people-talking.png'
import {FaFacebook, FaSquareXTwitter, FaDiscord, FaInstagram, FaLinkedin, FaGithub, FaImage} from "react-icons/fa6";
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
    return (
        <>
            <section
                className={'text-white w-screen h-screen bg-sky-500 flex flex-col justify-center items-center hover:bg-opacity-50'}>
                <h1 className={'font-header font-medium text-[20em]/[1.1em]'}>CRUCIWORDO</h1>
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
            <section className={'text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center relative'}>
                <h2 className={'text-5xl font-header'}>Total Games</h2>
                <h2 className={'text-5xl font-header text-amber-400'}>50</h2>
                <img src={man_standing} alt={'standing man pointing from humaans'} className={'absolute left-1/4 h-2/3'}/>
                <img src={woman_walking} alt={'walking woman from humaans'} className={'absolute right-1/4 h-2/3'}/>
            </section>
            <section id={'stats'}
                className={'text-stone-600 w-screen bg-white p-32 overflow-hidden flex flex-row gap-6 justify-center items-center relative'}>
                <article className={'bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <FaImage className={'w-full h-full'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Games Played</p>
                        <p>8 and counting!</p>
                    </div>
                </article>
                <article className={'bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <FaImage className={'w-full h-full'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Games Won</p>
                        <p>4 and getting better!</p>
                    </div>
                </article>
                <article className={'bg-stone-100 flex flex-col rounded-lg p-4 w-full'}>
                    <div className={'h-[200px] w-full flex bg-white rounded-lg justify-center items-center'}>
                        <FaImage className={'w-full h-full'}/>
                    </div>
                    <div className={'pb-6'}>
                        <p className={'font-header text-xl'}>Global score</p>
                        <p>2492 points</p>
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
