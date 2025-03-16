import {useEffect, useState} from "react";
import {DbConnection} from "@spacetime";
import type {ErrorContext} from "@spacetime";
import {Identity} from "@clockworklabs/spacetimedb-sdk";

type ConnectionState = "NONE" | "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED"

const useConnection = (): [typeof DbConnection | null, ConnectionState] => {
    const [conn, setConnection] = useState<typeof DbConnection | null>(null)
    const [connectionState, setConnectionState] = useState<ConnectionState>("NONE")
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
        setConnectionState("CONNECTING");

        setConnection(
            DbConnection.builder()
                .withUri('ws://localhost:3000')
                .withModuleName('cruciwordo')
                .withToken(localStorage.getItem('token') || '')
                .onConnect((connection: typeof DbConnection, identity: Identity, token: string) => {
                    localStorage.setItem('token', token)

                    setConnectionState("CONNECTED")
                })
                .onDisconnect((errorCtx: ErrorContext, error?: Error) => {
                    setConnectionState("DISCONNECTED")
                    setError(error)
                })
                .onConnectError((errorCtx: ErrorContext, error?: Error) => {
                    setConnectionState("FAILED")
                    setError(error)
                })
                .build()
        )
    }, [])

    useEffect(() => {
        console.log("=> Connection state is ", connectionState)
    }, [connectionState])

    useEffect(() => {
        if (error) {
            console.error("=> SpacetimeDb Error ", error)
        }
    }, [error])

    return [conn, connectionState]
}

export default useConnection;