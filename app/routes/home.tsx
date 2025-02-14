import type {Route} from "./+types/home";
import {Hero} from "~/components/cards/hero";

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
            <Hero/>
        </>
    )
}
