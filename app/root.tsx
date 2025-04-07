import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type {Route} from "./+types/root";
import stylesheet from "./app.css?url";
import React, {useMemo} from "react";
import item_not_found from "~/assets/item_not_found.png";

export const links: Route.LinksFunction = () => [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    {rel: "stylesheet", href: stylesheet},
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
    {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"},
];

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
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

// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   let message = "Oops!";
//   let details = "An unexpected error occurred.";
//   let stack: string | undefined;
//
//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? "404" : "Error";
//     details =
//       error.status === 404
//         ? "The requested page could not be found."
//         : error.statusText || details;
//   } else if (import.meta.env.DEV && error && error instanceof Error) {
//     details = error.message;
//     stack = error.stack;
//   }
//
//   return (
//     <main className="ontainer mx-auto">
//       <h1>{message}</h1>
//       <p>{details}</p>
//       {stack && (
//         <pre className="w-full p-4 overflow-x-auto">
//           {/* Lets put state management in here */}
//             <code>{stack}</code>
//         </pre>
//       )}
//     </main>
//   );
// }

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
