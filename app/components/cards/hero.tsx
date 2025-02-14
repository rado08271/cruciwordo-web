import Card from "~/components/common/card/card";
import React, {useEffect} from "react";
import {TfiControlPlay, TfiCup, TfiSettings} from "react-icons/tfi";

export const Hero = () => {

    useEffect(() => {
        console.log("effect")
    }, []);

    return (
        <>
            <Card>
                <Card.Title>Cruciwordo</Card.Title>
                <Card.Subtitle>The ultimate Keyword Search puzzle</Card.Subtitle>
                <Card.PrimaryButton route={"/create"} icon={<TfiControlPlay/>}>Play Now</Card.PrimaryButton>
                {/*<Card.Button route={"#"} icon={<TfiSettings/>}>Setting</Card.Button>*/}
                {/*<Card.Button route={"#"} icon={<TfiCup/>}>Leaderboard</Card.Button>*/}
                <Card.Caption>Challenge your vocabulary and puzzle-solving skills!</Card.Caption>
                <Card.Caption>Find hidden words and beat the clock.</Card.Caption>
            </Card>
            {/*<div className={'text-blue-800 inline-flex gap-4 justify-center w-full pt-8 text-sm'}>*/}
            {/*    <a href={"#"}>About</a>*/}
            {/*    <a href={"#"}>|</a>*/}
            {/*    <a href={"#"}>How to Play</a>*/}
            {/*</div>*/}
        </>
    );
};
