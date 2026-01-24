import React, {lazy, Suspense} from "react";
import Loading from "~/components/common/loading/loading";
import type {Route} from "../../.react-router/types/app/routes/+types/home";

const CreateGrid = lazy(() => import('~/components/cards/create-grid'))

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Create a New Puzzle | Cruciwordo"},
        { name: "description", content: "Design your own word search puzzle in Cruciwordo. Create custom challenges, share with friends, and play together in real-time."},
        { name: "keywords", content: "create crossword, word puzzle creator, custom word search, puzzle maker, multiplayer puzzle creator"},
        { name: "author", content: "Radoslav Figura" },

        { property: "og:type", content: "website"},
        { property: "og:site_name", content: "Cruciwordo" },
        { property: "og:url", content: "https://cruciwordo.com/create"},
        { property: "og:title", content: "Create a New Puzzle | Cruciwordo"},
        { property: "og:description", content: "Design your own word search puzzle in Cruciwordo. Create custom challenges, share with friends, and play together in real-time."},
        { property: "og:image", content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg` },

        { property: "twitter:card", content: "summary_large_image"},
        { property: "twitter:url", content: "https://cruciwordo.com/create"},
        { property: "twitter:title", content: "Create a New Puzzle | Cruciwordo"},
        { property: "twitter:description", content: "Design your own word search puzzle in Cruciwordo. Create custom challenges, share with friends, and play together in real-time."},
        { property: "twitter:image", content: `https://${import.meta.env.VITE_DEFAULT_URL}/images/cruciwordo-social-preview.jpg` },

        { name: "robots", content: "index, follow"},
        { name: "language", content: "English"},

    ];
}


export default function Create() {
    return (
        <>
            <Suspense fallback={
                <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}>
                    <Loading/>
                </div>
            }>
                <CreateGrid/>
            </Suspense>
        </>
    );
}
