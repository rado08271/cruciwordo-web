import { DbConnection, type ErrorContext } from "@spacetime";
import type { DbConnectionBuilder, Identity } from "spacetimedb";

type ConnectionConnectedListener = (connection: DbConnection) => void
type ConnectionStateChangeListener = (state: ConnectionState) => void
type ConnectionErrorListener = (error: Error) => void
export type ConnectionState = "NONE" | "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED"

export class Connection  {
    private dbConnectionBuilder: DbConnectionBuilder<DbConnection>
    private dbConnection?: DbConnection

    private onConnectedListener?: ConnectionConnectedListener
    private onErrorListener?: ConnectionErrorListener
    private onStateChangeListener?: ConnectionStateChangeListener

    constructor(ssr?: boolean) {
        this.dbConnectionBuilder = DbConnection.builder()
            .onConnect((connection: DbConnection, identity: Identity, token: string) => {
                if (!ssr) {
                    localStorage.setItem('auth_token', token)
                    sessionStorage.setItem('identity', identity.toHexString())
                }

                if (connection.isActive) {
                    this.dbConnection = connection

                    if (this.onStateChangeListener) {
                        this.onStateChangeListener("CONNECTED")
                    }

                    if (this.onConnectedListener) {
                        this.onConnectedListener(this.dbConnection)
                    }
                } else {

                }
            })
            .onDisconnect((errorCtx: ErrorContext, error?: Error) => {
                if (this.onStateChangeListener) this.onStateChangeListener("DISCONNECTED")

                if (error && this.onErrorListener)
                    this.onErrorListener(error)
            })
            .onConnectError((errorCtx: ErrorContext, error?: Error) => {
                if (this.onStateChangeListener) this.onStateChangeListener("FAILED")

                if (error && this.onErrorListener)
                    this.onErrorListener(error)
            })


        this.dbConnectionBuilder.withUri("ws://localhost:3000")
        this.dbConnectionBuilder.withModuleName(import.meta.env.VITE_SPACETIME_MODULE)

        // to ensure we only access local storage when client is available
        if (!ssr) {
            this.dbConnectionBuilder.withToken(localStorage.getItem('auth_token') || '')
        }
    }

    public addOnConnect = (onConnectedListener: ConnectionConnectedListener): Connection => {
        this.onConnectedListener = onConnectedListener
        return this
    }

    public addOnError = (onErrorListener: ConnectionErrorListener): Connection => {
        this.onErrorListener = onErrorListener
        return this
    }

    public addOnStateChangeListener = (onStateChangeListener: ConnectionStateChangeListener): Connection => {
        this.onStateChangeListener = onStateChangeListener
        return this
    }

    public builder = () => {
        return this.dbConnectionBuilder;
    }
}