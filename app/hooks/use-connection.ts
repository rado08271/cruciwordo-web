import {useEffect, useState} from "react";
import {DbConnection} from "@spacetime";
import {Connection, type ConnectionState} from "~/service/connection";
import type { DbConnectionBuilder } from "spacetimedb";

const useInitConnection = () => {
    const [connection, setConnection] = useState<DbConnection | null>(null)
    const [builder, setConnectionBuilder] = useState<DbConnectionBuilder<DbConnection> | null>(null)
    const [connectionState, setConnectionState] = useState<ConnectionState>("NONE")
    const [connectionError, setConnectionError] = useState<Error | undefined>()

    useEffect(() => {
        const conn = new Connection()
            .addOnConnect((connectionResult) => {
                console.log("======== DB Connected successfully")
                setConnection(connectionResult)
            })
            .addOnError((error) => {
                console.error("======== DB error", error)
                setConnectionError(error)
            })
            .addOnStateChangeListener(state => {
                console.log("======== DB stated changeds", state)
                setConnectionState(state)
            })

        setConnectionBuilder(conn.builder())
    }, [])

    return { connection, connectionState, connectionBuilder: builder }
}

export default useInitConnection;