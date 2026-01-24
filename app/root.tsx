import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import React, { useMemo } from "react";
import { SpacetimeDBProvider } from "spacetimedb/react";
import item_not_found from "~/assets/item_not_found.png";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { DbConnection } from "./spacetime_bridge";

export const links: Route.LinksFunction = () => [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: 'https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=League+Gothic&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {rel: "stylesheet", href: stylesheet},
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
    {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"},

    {rel: "canonical", href: "https://cruciwordo.com/"},
];

export function Layout({children}: { children: React.ReactNode }) {
    const schemeOrgData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Cruciwordo",
        "url": "https://cruciwordo.com",
        "description": "Interactive multiplayer word search puzzle game where players collaborate to find words and uncover solutions.",
        "applicationCategory": "GameApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }

    

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <script type="application/ld+json">
                {JSON.stringify(schemeOrgData)}
            </script>
            <Meta/>
            <Links/>
        </head>
        <body>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}

export function ErrorBoundary({error,}: Route.ErrorBoundaryProps) {
    const errorText = useMemo(() => {
        if (isRouteErrorResponse(error)) {
            return error.data
        }

        if (error instanceof Error) {
            return error.message
        }

        return "Unknown error!"
    }, [error])

    const errorStatus = useMemo(() => {
        if (isRouteErrorResponse(error)) {
            return error.status
        }

        if (error instanceof Error) {
            return "Oops something went wrong!"
        }

        return "Unknown status!"
    }, [error])

    const stack = useMemo(() => {
        if (error instanceof Error) {
            return error.stack
        }
        return ""
    }, [error])


    //  && error === 404) {
    return (
        <>
            <article className={'w-screen h-screen bg-stone-500 flex flex-col-reverse md:flex-row justify-center items-center gap-4 md:gap-20'}>
                <section className={'md:flex-1 flex flex-col justify-center items-center font-header text-stone-600 gap-4'}>
                    <div className={'text-5xl'}>{errorStatus}</div>
                    <div className={'h-1 w-1/2 bg-stone-600 rounded'}></div>
                    <div className={'text-md'}>{errorText}</div>

                    {stack && <pre className="w-full p-4 overflow-x-auto">
                        <code>{stack}</code>
                    </pre>}
                </section>

                <div className={'hidden md:visible h-1/2 w-1 bg-stone-600 rounded'}></div>
                {/*<div className={'visible md:hidden h-1 w-1/2 bg-stone-600 rounded'}></div>*/}

                <section className={'md:flex-1 flex justify-center items-center'}>
                    <img src={item_not_found} alt={'not found - person who does not care'}/>
                </section>
            </article>
        </>
    );
}
