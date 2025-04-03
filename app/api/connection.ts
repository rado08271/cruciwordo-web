import {DbConnection, type ErrorContext, type SubscriptionEventContext} from "@spacetime";
import {DbConnectionBuilder, Identity} from "@clockworklabs/spacetimedb-sdk";

type ConnectionConnectedListener = (connection: DbConnection) => void
type ConnectionStateChangeListener = (state: ConnectionState) => void
type ConnectionErrorListener = (error: Error) => void
export type ConnectionState = "NONE" | "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED"

export class Connection  {
    private dbConnectionBuilder: DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext>
    private dbConnection?: DbConnection

    private onConnectedListener?: ConnectionConnectedListener
    private onErrorListener?: ConnectionErrorListener
    private onStateChangeListener?: ConnectionStateChangeListener

    private constructor() {
        this.dbConnectionBuilder = DbConnection.builder()
            .withUri('ws://localhost:3000')
            .withModuleName('cruciwordo')
            .withToken(localStorage.getItem('token') || '')
            .onConnect((connection: DbConnection, identity: Identity, token: string) => {
                localStorage.setItem('token', token)
                sessionStorage.setItem('identity', identity.toHexString())

                if (connection.isActive) {
                    this.dbConnection = connection

                    if (this.onStateChangeListener) {
                        this.onStateChangeListener("CONNECTED")
                    }

                    if (this.onConnectedListener) {
                        this.onConnectedListener(connection)
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

    public connect = () => {
        this.dbConnectionBuilder.build()
    }

    public disconnect = () => {
        if (this.dbConnection) {
            this.dbConnection.disconnect()
            this.dbConnection = undefined
        }
    }
}