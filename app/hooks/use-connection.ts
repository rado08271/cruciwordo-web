import {useEffect, useState} from "react";
import {DbConnection} from "@spacetime";
import {Connection, type ConnectionState} from "~/api/connection";

const useConnection = (): [typeof DbConnection | null, ConnectionState] => {
    const [conn, setConnection] = useState<typeof DbConnection | null>(null)
    const [connectionState, setConnectionState] = useState<ConnectionState>("NONE")
    const [connectionError, setConnectionError] = useState<Error | undefined>()

    useEffect(() => {
        const connection = new Connection()
            .addOnConnect((connection) => {
                // console.log("======== DB Connected successfully")
                setConnection(connection)
            })
            .addOnError((error) => {
                // console.error("======== DB error", error)
                setConnectionError(error)
            })
            .addOnStateChangeListener(state => {
                // console.log("======== DB stated changeds", state)
                setConnectionState(state)
            })

        connection.connect()

        return () => {
            connection.disconnect()
        }
    }, [])

    return [conn, connectionState]
}

export default useConnection;