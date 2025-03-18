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
                .onConnect((connection: DbConnection, identity: Identity, token: string) => {
                    localStorage.setItem('token', token)
                    localStorage.setItem('identity', identity.toHexString())

                    console.log('identity', identity)
                    connection.subscriptionBuilder()
                        .onApplied(ctx => {
                            console.log("user boards", ctx.db.board.count())
                        })
                        .subscribe(`SELECT * FROM board WHERE created_by = '87749965386410529147125650381150036498542690511605788654083790035634710909461n'`)

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